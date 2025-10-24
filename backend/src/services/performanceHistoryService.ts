import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Serviço de Histórico de Performance
 */
export class PerformanceHistoryService {
  /**
   * Salva performance de um treino
   */
  async savePerformance(data: {
    userId: string;
    exerciseId: string;
    weight?: number;
    reps?: number;
    sets?: number;
    duration?: number;
    rpe?: number;
    notes?: string;
  }) {
    try {
      return await prisma.performanceHistory.create({
        data: {
          ...data,
          date: new Date()
        }
      });
    } catch (error) {
      console.error('Erro ao salvar performance:', error);
      throw error;
    }
  }

  /**
   * Obtém histórico de um exercício
   */
  async getHistory(userId: string, exerciseId?: string, limit: number = 50) {
    try {
      const where: any = { userId };
      if (exerciseId) where.exerciseId = exerciseId;

      return await prisma.performanceHistory.findMany({
        where,
        orderBy: { date: 'desc' },
        take: limit,
        include: { exercise: true }
      });
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      return [];
    }
  }

  /**
   * Obtém PRs (Personal Records)
   */
  async getPersonalRecords(userId: string, exerciseId: string) {
    try {
      const history = await this.getHistory(userId, exerciseId);
      
      if (history.length === 0) return null;

      const maxWeight = Math.max(...history.map(h => h.weight || 0));
      const maxReps = Math.max(...history.map(h => h.reps || 0));
      const maxVolume = Math.max(...history.map(h => (h.weight || 0) * (h.reps || 0) * (h.sets || 0)));

      return {
        maxWeight,
        maxReps,
        maxVolume,
        totalSessions: history.length
      };
    } catch (error) {
      console.error('Erro ao calcular PRs:', error);
      return null;
    }
  }

  /**
   * Calcula médias
   */
  async getAverages(userId: string, exerciseId: string, lastNSessions: number = 5) {
    try {
      const history = await this.getHistory(userId, exerciseId, lastNSessions);
      
      if (history.length === 0) return null;

      const avgWeight = history.reduce((sum, h) => sum + (h.weight || 0), 0) / history.length;
      const avgReps = history.reduce((sum, h) => sum + (h.reps || 0), 0) / history.length;
      const avgSets = history.reduce((sum, h) => sum + (h.sets || 0), 0) / history.length;

      return {
        avgWeight: Math.round(avgWeight * 10) / 10,
        avgReps: Math.round(avgReps),
        avgSets: Math.round(avgSets)
      };
    } catch (error) {
      console.error('Erro ao calcular médias:', error);
      return null;
    }
  }

  /**
   * Obtém tendência de progressão
   */
  async getTrend(userId: string, exerciseId: string) {
    try {
      const history = await this.getHistory(userId, exerciseId, 10);
      
      if (history.length < 2) return 'neutral';

      const weights = history.reverse().map(h => h.weight || 0);
      const firstHalf = weights.slice(0, Math.floor(weights.length / 2));
      const secondHalf = weights.slice(Math.floor(weights.length / 2));

      const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

      const diff = avgSecond - avgFirst;
      
      if (diff > 2) return 'improving';
      if (diff < -2) return 'declining';
      return 'maintaining';
    } catch (error) {
      console.error('Erro ao calcular tendência:', error);
      return 'neutral';
    }
  }
}

export default new PerformanceHistoryService();


