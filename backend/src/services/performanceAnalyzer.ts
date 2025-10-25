import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Serviço de Análise de Performance - MVP v0.01
 * 
 * MVP v0.01: Análise avançada desabilitada temporariamente
 * TODO: Reativar na v0.02
 */
export class PerformanceAnalyzer {
  /**
   * Analisa consistência do usuário - MVP v0.01
   */
  async analyzeConsistency(userId: string, period: 'week' | 'month' | 'quarter') {
    // MVP v0.01: Análise básica
    return this.getBasicConsistency(userId, period);
  }

  // MVP v0.01: Análise básica
  private getBasicConsistency(userId: string, period: string) {
    return {
      period,
      totalWorkouts: 0,
      completionRate: 0,
      currentStreak: 0,
      consistencyScore: 0,
      averageSessionDuration: 0,
      message: "Análise avançada em breve!"
    };
  }

  // MVP v0.01: Método original comentado
  /*
  async analyzeConsistency(userId: string, period: 'week' | 'month' | 'quarter') {
    try {
      const days = period === 'week' ? 7 : period === 'month' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const workoutLogs = await prisma.workoutLog.findMany({
        where: {
          userId,
          completedAt: { gte: startDate }
        },
        orderBy: { completedAt: 'asc' }
      });

      const completionRate = this.calculateCompletionRate(workoutLogs, days);
      const currentStreak = this.calculateStreak(workoutLogs);
      const consistencyScore = this.calculateConsistencyScore(workoutLogs);

      return {
        period,
        totalWorkouts: workoutLogs.length,
        completionRate,
        currentStreak,
        consistencyScore,
        averageSessionDuration: this.calculateAverageDuration(workoutLogs),
        recommendations: this.generateConsistencyRecommendations(completionRate, currentStreak)
      };
    } catch (error) {
      console.error('Erro ao analisar consistência:', error);
      throw error;
    }
  }
  */

  /**
   * Analisa progressão em exercícios - MVP v0.01
   */
  async analyzeProgression(userId: string, exerciseId?: string) {
    // MVP v0.01: Análise básica
    return this.getBasicProgression(userId, exerciseId);
  }

  // MVP v0.01: Análise básica de progressão
  private getBasicProgression(userId: string, exerciseId?: string) {
    return {
      message: "Análise de progressão em breve!",
      progression: 0,
      trend: "stable"
    };
  }

  // MVP v0.01: Método original comentado
  /*
  async analyzeProgression(userId: string, exerciseId?: string) {
    try {
      const where: any = { userId };
      if (exerciseId) where.exerciseId = exerciseId;

      const history = await prisma.performanceHistory.findMany({
        where,
        orderBy: { date: 'asc' },
        take: 100
      });

      if (history.length === 0) {
        return { message: 'Sem dados de performance' };
      }

      const strengthGains = this.calculateStrengthGains(history);
      const volumeProgression = this.calculateVolumeProgression(history);
      const plateauDetection = this.detectPlateaus(history);

      return {
        strengthGains,
        volumeProgression,
        plateauDetection,
        improvementRate: this.calculateImprovementRate(history),
        suggestions: this.generateProgressionSuggestions(plateauDetection)
      };
    } catch (error) {
      console.error('Erro ao analisar progressão:', error);
      throw error;
    }
  }

  /**
   * Analisa progresso em objetivos
   */
  async analyzeGoalProgress(userId: string) {
    try {
      const profile = await prisma.userProfile.findUnique({
        where: { userId }
      });

      if (!profile) {
        return { message: 'Perfil não encontrado' };
      }

      const goals = JSON.parse(profile.primaryGoals);
      const workoutLogs = await prisma.workoutLog.findMany({
        where: { userId },
        orderBy: { completedAt: 'desc' },
        take: 30
      });

      return {
        goals,
        workoutsCompleted: workoutLogs.length,
        progressPercentage: this.calculateGoalProgress(goals, workoutLogs),
        estimatedTimeToGoal: this.estimateTimeToGoal(workoutLogs),
        milestones: this.identifyMilestones(workoutLogs)
      };
    } catch (error) {
      console.error('Erro ao analisar progresso de objetivos:', error);
      throw error;
    }
  }

  // ============================================================================
  // MÉTODOS AUXILIARES
  // ============================================================================

  private calculateCompletionRate(logs: any[], totalDays: number): number {
    return (logs.length / totalDays) * 100;
  }

  private calculateStreak(logs: any[]): number {
    if (logs.length === 0) return 0;

    let streak = 1;
    for (let i = logs.length - 1; i > 0; i--) {
      const current = new Date(logs[i].completedAt);
      const previous = new Date(logs[i - 1].completedAt);
      const diffDays = Math.floor((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays <= 2) { // Permite 1 dia de descanso
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  private calculateConsistencyScore(logs: any[]): number {
    if (logs.length === 0) return 0;
    
    const expectedWorkouts = 12; // 3x por semana por 1 mês
    const score = Math.min((logs.length / expectedWorkouts) * 100, 100);
    return Math.round(score);
  }

  private calculateAverageDuration(logs: any[]): number {
    if (logs.length === 0) return 0;
    
    const total = logs.reduce((sum, log) => sum + (log.duration || 0), 0);
    return Math.round(total / logs.length);
  }

  private calculateStrengthGains(history: any[]): any {
    if (history.length < 2) return { gains: 0, trend: 'insufficient_data' };

    const first = history[0];
    const last = history[history.length - 1];

    const initialWeight = first.weight || 0;
    const currentWeight = last.weight || 0;
    const gains = ((currentWeight - initialWeight) / initialWeight) * 100;

    return {
      gains: Math.round(gains * 10) / 10,
      trend: gains > 5 ? 'improving' : gains > 0 ? 'maintaining' : 'declining',
      initialWeight,
      currentWeight
    };
  }

  private calculateVolumeProgression(history: any[]): any {
    if (history.length < 2) return { progression: 0 };

    const volumes = history.map(h => (h.weight || 0) * (h.reps || 0) * (h.sets || 0));
    const avgFirst = volumes.slice(0, Math.floor(volumes.length / 2)).reduce((a, b) => a + b, 0) / Math.floor(volumes.length / 2);
    const avgLast = volumes.slice(Math.floor(volumes.length / 2)).reduce((a, b) => a + b, 0) / Math.ceil(volumes.length / 2);

    const progression = ((avgLast - avgFirst) / avgFirst) * 100;

    return {
      progression: Math.round(progression * 10) / 10,
      trend: progression > 0 ? 'increasing' : 'decreasing'
    };
  }

  private detectPlateaus(history: any[]): any {
    if (history.length < 5) return { hasPlateau: false };

    const lastFive = history.slice(-5);
    const weights = lastFive.map(h => h.weight || 0);
    const variance = this.calculateVariance(weights);

    return {
      hasPlateau: variance < 1, // Pouca variação indica plateau
      suggestion: variance < 1 ? 'Considere mudar o programa ou aumentar intensidade' : 'Continue progredindo'
    };
  }

  private calculateVariance(numbers: number[]): number {
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const squaredDiffs = numbers.map(n => Math.pow(n - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / numbers.length;
  }

  private calculateImprovementRate(history: any[]): number {
    if (history.length < 2) return 0;

    const improvements = history.filter((h, i) => {
      if (i === 0) return false;
      return (h.weight || 0) > (history[i - 1].weight || 0);
    });

    return (improvements.length / (history.length - 1)) * 100;
  }

  private generateConsistencyRecommendations(rate: number, streak: number): string[] {
    const recs = [];

    if (rate < 50) {
      recs.push('Tente treinar pelo menos 3x por semana para melhores resultados');
    } else if (rate > 80) {
      recs.push('Excelente consistência! Continue assim');
    }

    if (streak > 7) {
      recs.push(`Parabéns! Você está em uma sequência de ${streak} dias`);
    }

    return recs;
  }

  private generateProgressionSuggestions(plateau: any): string[] {
    if (plateau.hasPlateau) {
      return [
        'Considere aumentar o volume de treino',
        'Experimente variar os exercícios',
        'Pode ser hora de um deload'
      ];
    }

    return ['Continue com o programa atual'];
  }

  private calculateGoalProgress(goals: string[], logs: any[]): number {
    // Simplificado - calcular baseado em workouts completados
    const target = 30; // 30 workouts para atingir objetivo inicial
    return Math.min((logs.length / target) * 100, 100);
  }

  private estimateTimeToGoal(logs: any[]): number {
    if (logs.length === 0) return 0;
    
    const avgWorkoutsPerWeek = logs.length / 4; // Assumindo 1 mês de dados
    const target = 30;
    const remaining = Math.max(target - logs.length, 0);
    
    return Math.ceil(remaining / avgWorkoutsPerWeek);
  }

  private identifyMilestones(logs: any[]): string[] {
    const milestones = [];
    
    if (logs.length >= 10) milestones.push('10 treinos completados');
    if (logs.length >= 25) milestones.push('25 treinos completados');
    if (logs.length >= 50) milestones.push('50 treinos completados');
    
    return milestones;
  }
  
}

export default new PerformanceAnalyzer();


