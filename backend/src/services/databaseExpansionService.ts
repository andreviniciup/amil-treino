import prisma from '../config/database';
import hybridExerciseService from './hybridExerciseService';

class DatabaseExpansionService {
  private readonly BODY_PARTS = [
    'chest', 'back', 'shoulders', 'arms', 'legs', 'core',
    'neck', 'waist', 'upper legs', 'lower legs', 'upper arms', 'lower arms'
  ];

  private readonly EQUIPMENT_TYPES = [
    'barbell', 'dumbbell', 'cable', 'body weight', 'kettlebell',
    'resistance band', 'stability ball', 'medicine ball', 'machine'
  ];

  /**
   * Expande a base de dados com mais exercícios
   */
  async expandDatabase(): Promise<{
    success: boolean;
    message: string;
    data: {
      bodyPartsProcessed: number;
      totalExercisesAdded: number;
      errors: number;
    };
  }> {
    try {
      console.log('🚀 Starting database expansion...');
      
      let totalExercisesAdded = 0;
      let errors = 0;
      let bodyPartsProcessed = 0;

      for (const bodyPart of this.BODY_PARTS) {
        try {
          console.log(`📊 Processing ${bodyPart} exercises...`);
          
          // Buscar exercícios para esta parte do corpo
          const exercises = await hybridExerciseService.getExercisesByBodyPart(bodyPart);
          
          if (exercises.length > 0) {
            totalExercisesAdded += exercises.length;
            console.log(`✅ Added ${exercises.length} ${bodyPart} exercises`);
          }
          
          bodyPartsProcessed++;
          
          // Pequena pausa para não sobrecarregar as APIs
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.error(`❌ Error processing ${bodyPart}:`, error);
          errors++;
        }
      }

      // Processar por equipamento também
      for (const equipment of this.EQUIPMENT_TYPES) {
        try {
          console.log(`🔧 Processing ${equipment} exercises...`);
          
          // Buscar exercícios por equipamento usando getAllExercises e filtrar
          const allExercises = await hybridExerciseService.getAllExercises();
          const equipmentExercises = allExercises.filter(ex => 
            ex.equipment?.toLowerCase().includes(equipment.toLowerCase())
          );
          
          if (equipmentExercises.length > 0) {
            totalExercisesAdded += equipmentExercises.length;
            console.log(`✅ Found ${equipmentExercises.length} ${equipment} exercises`);
          }
          
          // Pequena pausa
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.error(`❌ Error processing ${equipment}:`, error);
          errors++;
        }
      }

      console.log(`🎉 Database expansion completed!`);
      console.log(`📊 Total exercises added: ${totalExercisesAdded}`);
      console.log(`📊 Body parts processed: ${bodyPartsProcessed}`);
      console.log(`❌ Errors: ${errors}`);

      return {
        success: true,
        message: 'Database expansion completed successfully',
        data: {
          bodyPartsProcessed,
          totalExercisesAdded,
          errors
        }
      };

    } catch (error) {
      console.error('❌ Error in database expansion:', error);
      return {
        success: false,
        message: 'Database expansion failed',
        data: {
          bodyPartsProcessed: 0,
          totalExercisesAdded: 0,
          errors: 1
        }
      };
    }
  }

  /**
   * Obtém estatísticas da base de dados
   */
  async getDatabaseStats(): Promise<{
    totalExercises: number;
    byBodyPart: Record<string, number>;
    byEquipment: Record<string, number>;
    byDifficulty: Record<string, number>;
    withImages: number;
    withoutImages: number;
  }> {
    try {
      const totalExercises = await prisma.exercise.count();
      
      // Estatísticas por parte do corpo
      const bodyPartStats = await prisma.exercise.groupBy({
        by: ['bodyPart'],
        _count: true,
        orderBy: { _count: { bodyPart: 'desc' } }
      });

      // Estatísticas por equipamento
      const equipmentStats = await prisma.exercise.groupBy({
        by: ['equipment'],
        _count: true,
        orderBy: { _count: { equipment: 'desc' } }
      });

      // Estatísticas por dificuldade (simplificado)
      const difficultyStats: any[] = [];

      // Exercícios com e sem imagens
      const withImages = await prisma.exercise.count({
        where: {
          AND: [
            { gifUrl: { not: null } },
            { gifUrl: { not: '' } },
            { gifUrl: { not: { contains: 'placeholder' } } }
          ]
        }
      });

      const withoutImages = totalExercises - withImages;

      return {
        totalExercises,
        byBodyPart: bodyPartStats.reduce((acc, stat) => {
          acc[stat.bodyPart || 'unknown'] = stat._count;
          return acc;
        }, {} as Record<string, number>),
        byEquipment: equipmentStats.reduce((acc, stat) => {
          acc[stat.equipment || 'unknown'] = stat._count;
          return acc;
        }, {} as Record<string, number>),
        byDifficulty: difficultyStats.reduce((acc, stat) => {
          acc[stat.name || 'unknown'] = stat._count;
          return acc;
        }, {} as Record<string, number>),
        withImages,
        withoutImages
      };

    } catch (error) {
      console.error('Error getting database stats:', error);
      return {
        totalExercises: 0,
        byBodyPart: {},
        byEquipment: {},
        byDifficulty: {},
        withImages: 0,
        withoutImages: 0
      };
    }
  }

  /**
   * Limpa exercícios duplicados
   */
  async cleanDuplicates(): Promise<{
    success: boolean;
    message: string;
    duplicatesRemoved: number;
  }> {
    try {
      console.log('🧹 Cleaning duplicate exercises...');
      
      // Encontrar duplicatas por nome
      const duplicates = await prisma.$queryRaw`
        SELECT name, COUNT(*) as count
        FROM Exercise
        GROUP BY name
        HAVING COUNT(*) > 1
      `;

      let duplicatesRemoved = 0;

      for (const duplicate of duplicates as any[]) {
        const exercises = await prisma.exercise.findMany({
          where: { name: duplicate.name },
          orderBy: { id: 'asc' }
        });

        // Manter apenas o primeiro, remover os outros
        const toRemove = exercises.slice(1);
        
        for (const exercise of toRemove) {
          await prisma.exercise.delete({
            where: { id: exercise.id }
          });
          duplicatesRemoved++;
        }
      }

      console.log(`✅ Removed ${duplicatesRemoved} duplicate exercises`);

      return {
        success: true,
        message: `Removed ${duplicatesRemoved} duplicate exercises`,
        duplicatesRemoved
      };

    } catch (error) {
      console.error('Error cleaning duplicates:', error);
      return {
        success: false,
        message: 'Failed to clean duplicates',
        duplicatesRemoved: 0
      };
    }
  }
}

export default new DatabaseExpansionService();
