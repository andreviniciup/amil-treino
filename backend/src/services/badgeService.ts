import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class BadgeService {
  // MVP v0.01: Badges desabilitados temporariamente
  // TODO: Reativar na v0.02
  async checkAndAwardBadges(userId: string) {
    // MVP v0.01: Retornar array vazio
    return [];
  }

  async getUserBadges(userId: string) {
    // MVP v0.01: Retornar array vazio
    return [];
  }

  // MVP v0.01: Badges originais comentados
  /*
  private readonly BADGES = [
    {
      name: '7 Dias Consecutivos',
      description: 'Treinou 7 dias seguidos',
      category: 'consistency',
      requirement: { streak: 7 },
      points: 100
    },
    {
      name: '30 Dias Consecutivos',
      description: 'Treinou 30 dias seguidos',
      category: 'consistency',
      requirement: { streak: 30 },
      points: 500
    },
    {
      name: 'Primeiro PR',
      description: 'Bateu seu primeiro recorde pessoal',
      category: 'progression',
      requirement: { prs: 1 },
      points: 50
    },
    {
      name: '10 Treinos',
      description: 'Completou 10 sessões de treino',
      category: 'consistency',
      requirement: { workouts: 10 },
      points: 100
    }
  ];

  async checkAndAwardBadges(userId: string) {
    try {
      const awarded = [];

      for (const badge of this.BADGES) {
        const hasRequirement = await this.checkRequirement(userId, badge.requirement);
        
        if (hasRequirement) {
          const alreadyHas = await this.userHasBadge(userId, badge.name);
          
          if (!alreadyHas) {
            await this.awardBadge(userId, badge);
            awarded.push(badge);
          }
        }
      }

      return awarded;
    } catch (error) {
      console.error('Erro ao verificar badges:', error);
      return [];
    }
  }

  private async checkRequirement(userId: string, requirement: any): boolean {
    if (requirement.streak) {
      const workouts = await prisma.workoutLog.findMany({
        where: { userId },
        orderBy: { completedAt: 'desc' }
      });
      
      let streak = 1;
      for (let i = 0; i < workouts.length - 1; i++) {
        const current = new Date(workouts[i].completedAt);
        const next = new Date(workouts[i + 1].completedAt);
        const diffDays = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 2) streak++;
        else break;
      }
      
      return streak >= requirement.streak;
    }

    if (requirement.workouts) {
      const count = await prisma.workoutLog.count({ where: { userId } });
      return count >= requirement.workouts;
    }

    return false;
  }

  private async userHasBadge(userId: string, badgeName: string): Promise<boolean> {
    const badge = await prisma.badge.findUnique({ where: { name: badgeName } });
    if (!badge) return false;

    const userBadge = await prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId: badge.id
        }
      }
    });

    return !!userBadge;
  }

  private async awardBadge(userId: string, badgeData: any) {
    let badge = await prisma.badge.findUnique({ where: { name: badgeData.name } });
    
    if (!badge) {
      badge = await prisma.badge.create({
        data: {
          name: badgeData.name,
          description: badgeData.description,
          category: badgeData.category,
          requirement: JSON.stringify(badgeData.requirement),
          points: badgeData.points
        }
      });
    }

    await prisma.userBadge.create({
      data: {
        userId,
        badgeId: badge.id
      }
    });
  }

  async getUserBadges(userId: string) {
    return await prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true }
    });
  }
  */
}

export default new BadgeService();


