import prisma from '../config/database';
import hybridExerciseService from './hybridExerciseService';

class AutoCacheService {
  private isInitialized = false;
  private lastSync: Date | null = null;
  private readonly SYNC_INTERVAL = 24 * 60 * 60 * 1000; // 24 horas

  /**
   * Inicializa o cache automático
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🔄 Initializing auto cache service...');
      
      // Verificar se o banco tem exercícios
      const exerciseCount = await prisma.exercise.count();
      
      if (exerciseCount === 0) {
        console.log('📥 Database empty, populating with exercises...');
        await this.populateDatabase();
      } else {
        console.log(`✅ Database has ${exerciseCount} exercises`);
      }

      // Atualizar imagens em background
      this.updateImagesInBackground();
      
      // Configurar sincronização periódica
      this.setupPeriodicSync();
      
      this.isInitialized = true;
      console.log('✅ Auto cache service initialized');
    } catch (error) {
      console.error('❌ Error initializing auto cache:', error);
    }
  }

  /**
   * Popula o banco de dados com exercícios
   */
  private async populateDatabase(): Promise<void> {
    try {
      console.log('📊 Fetching exercises from external APIs...');
      
      // Buscar exercícios por partes do corpo principais
      const bodyParts = ['chest', 'back', 'shoulders', 'arms', 'legs', 'core'];
      
      for (const bodyPart of bodyParts) {
        try {
          console.log(`🔍 Fetching ${bodyPart} exercises...`);
          const exercises = await hybridExerciseService.getExercisesByBodyPart(bodyPart);
          
          if (exercises.length > 0) {
            console.log(`✅ Found ${exercises.length} ${bodyPart} exercises`);
          }
        } catch (error) {
          console.error(`⚠️ Error fetching ${bodyPart} exercises:`, error);
        }
      }
      
      console.log('🎉 Database population completed');
    } catch (error) {
      console.error('❌ Error populating database:', error);
    }
  }

  /**
   * Atualiza imagens em background
   */
  private async updateImagesInBackground(): Promise<void> {
    try {
      console.log('🖼️ Starting background image update...');
      
      // Aguardar um pouco para não sobrecarregar
      setTimeout(async () => {
        try {
          const result = await hybridExerciseService.updateExerciseImages();
          console.log(`✅ Background image update completed: ${result.updated} updated, ${result.errors} errors`);
        } catch (error) {
          console.error('❌ Error in background image update:', error);
        }
      }, 5000); // 5 segundos de delay
      
    } catch (error) {
      console.error('❌ Error setting up background image update:', error);
    }
  }

  /**
   * Configura sincronização periódica
   */
  private setupPeriodicSync(): void {
    setInterval(async () => {
      try {
        console.log('🔄 Running periodic sync...');
        
        // Verificar se precisa sincronizar
        if (this.shouldSync()) {
          await this.syncData();
          this.lastSync = new Date();
        }
      } catch (error) {
        console.error('❌ Error in periodic sync:', error);
      }
    }, this.SYNC_INTERVAL);
  }

  /**
   * Verifica se deve sincronizar
   */
  private shouldSync(): boolean {
    if (!this.lastSync) return true;
    
    const now = new Date();
    const timeDiff = now.getTime() - this.lastSync.getTime();
    
    return timeDiff >= this.SYNC_INTERVAL;
  }

  /**
   * Sincroniza dados
   */
  private async syncData(): Promise<void> {
    try {
      console.log('🔄 Syncing data...');
      
      // Atualizar imagens
      await hybridExerciseService.updateExerciseImages();
      
      // Limpar cache se necessário
      await hybridExerciseService.clearInternalCache();
      
      console.log('✅ Data sync completed');
    } catch (error) {
      console.error('❌ Error syncing data:', error);
    }
  }

  /**
   * Força sincronização imediata
   */
  async forceSync(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔄 Force sync requested...');
      
      await this.syncData();
      this.lastSync = new Date();
      
      return {
        success: true,
        message: 'Force sync completed successfully'
      };
    } catch (error) {
      console.error('❌ Error in force sync:', error);
      return {
        success: false,
        message: 'Force sync failed'
      };
    }
  }

  /**
   * Estatísticas do cache
   */
  async getCacheStats(): Promise<{
    totalExercises: number;
    lastSync: Date | null;
    isInitialized: boolean;
    nextSync: Date | null;
  }> {
    try {
      const totalExercises = await prisma.exercise.count();
      const nextSync = this.lastSync 
        ? new Date(this.lastSync.getTime() + this.SYNC_INTERVAL)
        : null;

      return {
        totalExercises,
        lastSync: this.lastSync,
        isInitialized: this.isInitialized,
        nextSync
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return {
        totalExercises: 0,
        lastSync: null,
        isInitialized: false,
        nextSync: null
      };
    }
  }
}

export default new AutoCacheService();
