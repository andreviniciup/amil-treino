import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GamificationService {
  async calculateUserScore(userId: string) {
    try {
      // Buscar ou criar score do usuário
      let score = await prisma.userScore.findUnique({ where: { userId } });
      
      if (!score) {
        score = await prisma.userScore.create({
          data: { userId }
        });
      }

      // Calcular pontos de consistência
      const consistency = await this.calculateConsistencyPoints(userId);
      
      // Calcular pontos de progressão
      const progression = await this.calculateProgressionPoints(userId);
      
      // Calcular pontos de objetivos
      const goals = await this.calculateGoalPoints(userId);
      
      // Total
      const totalPoints = consistency + progression + goals;
      const level = this.calculateLevel(totalPoints);

      // Atualizar score
      await prisma.userScore.update({
        where: { userId },
        data: {
          totalPoints,
          consistencyPoints: consistency,
          progressionPoints: progression,
          goalPoints: goals,
          level
        }
      });

      return {
        totalPoints,
        consistencyPoints: consistency,
        progressionPoints: progression,
        goalPoints: goals,
        level,
        nextLevelPoints: (level + 1) * 100
      };
    } catch (error) {
      console.error('Erro ao calcular score:', error);
      throw error;
    }
  }

  private async calculateConsistencyPoints(userId: string): number {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const workouts = await prisma.workoutLog.findMany({
      where: {
        userId,
        completedAt: { gte: lastMonth }
      }
    });

    return workouts.length * 10; // 10 pontos por treino
  }

  private async calculateProgressionPoints(userId: string): number {
    const history = await prisma.performanceHistory.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 10
    });

    let points = 0;
    for (let i = 1; i < history.length; i++) {
      if ((history[i-1].weight || 0) > (history[i].weight || 0)) {
        points += 20; // 20 pontos por progressão
      }
    }

    return points;
  }

  private async calculateGoalPoints(userId: string): number {
    // Simplificado - pontos por badges conquistados
    const badges = await prisma.userBadge.findMany({
      where: { userId }
    });

    return badges.length * 50; // 50 pontos por badge
  }

  private calculateLevel(points: number): number {
    return Math.floor(points / 100) + 1;
  }
}

export default new GamificationService();


