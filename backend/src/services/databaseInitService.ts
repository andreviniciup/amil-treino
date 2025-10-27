import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import path from 'path';

const prisma = new PrismaClient();

/**
 * Serviço para garantir que o banco de dados esteja populado
 * Executa automaticamente na inicialização do servidor
 */
class DatabaseInitService {
  private isInitializing = false;
  private isInitialized = false;

  async initialize() {
    // Evitar múltiplas inicializações simultâneas
    if (this.isInitializing || this.isInitialized) {
      return;
    }

    this.isInitializing = true;

    try {
      console.log('\n🔍 Verificando estado do banco de dados...');

      // Verificar quantos exercícios existem
      const exerciseCount = await prisma.exercise.count();
      console.log(`📊 Exercícios no banco: ${exerciseCount}`);

      // Se tiver menos de 100 exercícios, o seed provavelmente falhou
      if (exerciseCount < 100) {
        console.log('\n⚠️  Banco com poucos exercícios! Iniciando seed...');
        console.log('⏱️  Isso vai demorar 5-10 minutos...\n');

        await this.runSeed();

        // Verificar resultado
        const newCount = await prisma.exercise.count();
        console.log(`\n✅ Seed concluído! Total no banco: ${newCount}`);

        if (newCount > 1000) {
          console.log('🎉 Banco populado com sucesso!\n');
          this.isInitialized = true;
        } else {
          console.log(`⚠️  Ainda com poucos exercícios (${newCount}). Verifique os logs de erro.\n`);
        }
      } else {
        console.log('✅ Banco já possui exercícios suficientes.\n');
        this.isInitialized = true;
      }
    } catch (error) {
      console.error('❌ Erro ao verificar banco de dados:', error);
    } finally {
      this.isInitializing = false;
      await prisma.$disconnect();
    }
  }

  private async runSeed() {
    try {
      // Executar seed via child process
      const projectRoot = path.resolve(__dirname, '../..');
      console.log(`📁 Executando seed em: ${projectRoot}`);
      
      // Em produção, usar node com o arquivo compilado
      // Em desenvolvimento, usar ts-node
      const isProduction = process.env.NODE_ENV === 'production';
      const command = isProduction
        ? 'node dist/scripts/seedExercisesFromAPI.js'
        : 'npx ts-node src/scripts/seedExercisesFromAPI.ts';
      
      console.log(`🚀 Comando: ${command}`);
      
      execSync(command, {
        cwd: projectRoot,
        stdio: 'inherit',
        env: {
          ...process.env,
          NODE_ENV: process.env.NODE_ENV || 'development'
        }
      });
    } catch (error) {
      console.error('❌ Erro ao executar seed:', error);
      throw error;
    }
  }

  /**
   * Verificar se o banco precisa de seed (chamada rápida)
   */
  async needsSeed(): Promise<boolean> {
    try {
      const count = await prisma.exercise.count();
      return count < 100;
    } catch (error) {
      console.error('Erro ao verificar necessidade de seed:', error);
      return false;
    } finally {
      await prisma.$disconnect();
    }
  }
}

export default new DatabaseInitService();
