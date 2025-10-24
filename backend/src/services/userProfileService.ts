import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Serviço de Perfil do Usuário
 * CRUD completo e análise de perfil
 */
export class UserProfileService {
  /**
   * Cria perfil para usuário
   */
  async createProfile(userId: string, data: any) {
    try {
      return await prisma.userProfile.create({
        data: {
          userId,
          fitnessLevel: data.fitnessLevel || 'Iniciante',
          primaryGoals: JSON.stringify(data.primaryGoals || []),
          secondaryGoals: JSON.stringify(data.secondaryGoals || []),
          trainingExperience: data.trainingExperience || 0,
          preferredIntensity: data.preferredIntensity || 'Média',
          availableTime: data.availableTime || 60,
          equipmentAccess: JSON.stringify(data.equipmentAccess || []),
          injuryHistory: JSON.stringify(data.injuryHistory || []),
          preferences: JSON.stringify(data.preferences || {})
        }
      });
    } catch (error) {
      console.error('Erro ao criar perfil:', error);
      throw error;
    }
  }

  /**
   * Obtém perfil do usuário
   */
  async getProfile(userId: string) {
    try {
      const profile = await prisma.userProfile.findUnique({
        where: { userId },
        include: { user: true }
      });

      if (!profile) return null;

      return {
        ...profile,
        primaryGoals: JSON.parse(profile.primaryGoals),
        secondaryGoals: JSON.parse(profile.secondaryGoals),
        equipmentAccess: profile.equipmentAccess ? JSON.parse(profile.equipmentAccess) : [],
        injuryHistory: profile.injuryHistory ? JSON.parse(profile.injuryHistory) : [],
        preferences: profile.preferences ? JSON.parse(profile.preferences) : {}
      };
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  }

  /**
   * Atualiza perfil
   */
  async updateProfile(userId: string, data: any) {
    try {
      const updateData: any = {};
      
      if (data.fitnessLevel) updateData.fitnessLevel = data.fitnessLevel;
      if (data.primaryGoals) updateData.primaryGoals = JSON.stringify(data.primaryGoals);
      if (data.secondaryGoals) updateData.secondaryGoals = JSON.stringify(data.secondaryGoals);
      if (data.trainingExperience !== undefined) updateData.trainingExperience = data.trainingExperience;
      if (data.preferredIntensity) updateData.preferredIntensity = data.preferredIntensity;
      if (data.availableTime) updateData.availableTime = data.availableTime;
      if (data.equipmentAccess) updateData.equipmentAccess = JSON.stringify(data.equipmentAccess);
      if (data.injuryHistory) updateData.injuryHistory = JSON.stringify(data.injuryHistory);
      if (data.preferences) updateData.preferences = JSON.stringify(data.preferences);

      return await prisma.userProfile.update({
        where: { userId },
        data: updateData
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  }

  /**
   * Analisa perfil e retorna insights
   */
  async analyzeProfile(userId: string) {
    const profile = await this.getProfile(userId);
    if (!profile) return null;

    const analysis = {
      completeness: this.calculateCompleteness(profile),
      recommendations: this.generateRecommendations(profile),
      needsUpdate: this.checkNeedsUpdate(profile)
    };

    return analysis;
  }

  private calculateCompleteness(profile: any): number {
    let score = 0;
    const fields = ['fitnessLevel', 'primaryGoals', 'trainingExperience', 'availableTime', 'equipmentAccess'];
    
    fields.forEach(field => {
      if (profile[field]) score += 20;
    });
    
    return score;
  }

  private generateRecommendations(profile: any): string[] {
    const recs = [];
    
    if (profile.trainingExperience < 1) {
      recs.push('Considere começar com um programa Full Body 3x por semana');
    }
    
    if (profile.injuryHistory && profile.injuryHistory.length > 0) {
      recs.push('Consulte um fisioterapeuta antes de iniciar treinos intensos');
    }
    
    return recs;
  }

  private checkNeedsUpdate(profile: any): boolean {
    const lastUpdate = new Date(profile.updatedAt);
    const now = new Date();
    const daysSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
    
    return daysSinceUpdate > 30;
  }
}

export default new UserProfileService();


