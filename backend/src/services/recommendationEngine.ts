import {
  RecommendationInput,
  RecommendationResult,
  TrainingMethodRecommendation,
  ExerciseRecommendation,
  UserProfile,
  PerformanceData,
  SimilarUser,
  HybridRecommendationResult,
  CollaborativeFilteringResult,
  ContentBasedResult,
  PerformanceBasedResult,
  RuleBasedResult
} from '../types/recommendation';
import trainingMethodService from './trainingMethodService';

/**
 * Engine de Recomendação Simplificado - MVP v0.01
 * 
 * MVP v0.01: Engine híbrido desabilitado temporariamente
 * TODO: Reativar na v0.02
 * 
 * Engine original comentado abaixo com 4 algoritmos:
 * 1. Collaborative Filtering - Baseado em usuários similares
 * 2. Content-Based - Baseado no perfil do usuário
 * 3. Performance-Based - Baseado no histórico de performance
 * 4. Rule-Based - Baseado em regras de negócio
 */
export class RecommendationEngine {
  // ============================================================================
  // MÉTODOS PRINCIPAIS - MVP v0.01
  // ============================================================================

  /**
   * Gera recomendações simples para um usuário - MVP v0.01
   */
  async generateRecommendations(userId: string): Promise<RecommendationResult> {
    try {
      // MVP v0.01: Usar apenas regras simples
      const userProfile = await this.getUserProfile(userId);
      const recommendations = this.getSimpleRecommendation(userProfile);
      
      return {
        userId,
        recommendations,
        confidence: 0.8,
        reasoning: "Recomendação baseada em regras simples para MVP",
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Erro ao gerar recomendações:', error);
      throw new Error('Falha ao gerar recomendações');
    }
  }

  // MVP v0.01: Método simples de recomendação
  private getSimpleRecommendation(userProfile: UserProfile): TrainingMethodRecommendation[] {
    const days = userProfile.availability.daysPerWeek;
    const level = userProfile.fitnessData.fitnessLevel;
    
    let recommendedMethod: string;
    let reasoning: string;
    
    // Lógica simples baseada em regras
    if (level === 'Iniciante' || days <= 3) {
      recommendedMethod = 'Full Body';
      reasoning = 'Iniciante ou poucos dias disponíveis → Full Body 3x por semana';
    } else if (level === 'Intermediário' && days >= 4 && days <= 5) {
      recommendedMethod = 'Upper/Lower';
      reasoning = 'Intermediário com 4-5 dias → Upper/Lower';
    } else if (level === 'Avançado' && days >= 5) {
      recommendedMethod = 'PPL (Push/Pull/Legs)';
      reasoning = 'Avançado com 5+ dias → PPL';
    } else {
      recommendedMethod = 'Full Body';
      reasoning = 'Recomendação padrão → Full Body';
    }
    
    const method = trainingMethodService.getMethodByName(recommendedMethod);
    if (!method) {
      return [];
    }
    
    return [{
      method,
      score: 80,
      confidence: 0.8,
      reasoning,
      pros: method.benefits,
      cons: [],
      alternatives: []
    }];
  }

  // MVP v0.01: Engine híbrido original comentado
  /*
  async generateRecommendations(userId: string): Promise<RecommendationResult> {
    try {
      // 1. Obter dados do usuário
      const userProfile = await this.getUserProfile(userId);
      const performanceHistory = await this.getPerformanceHistory(userId);
      const similarUsers = await this.findSimilarUsers(userId);

      // 2. Executar os 4 algoritmos em paralelo
      const [collaborative, contentBased, performanceBased, ruleBased] = await Promise.all([
        this.collaborativeFiltering(similarUsers),
        this.contentBasedFiltering(userProfile),
        this.performanceBasedFiltering(performanceHistory),
        this.ruleBasedFiltering(userProfile)
      ]);

      // 3. Combinar resultados
      const combinedRecommendations = this.combineRecommendations({
        collaborative,
        contentBased,
        performanceBased,
        ruleBased,
        combined: []
      }, userProfile);

      // 4. Gerar explicação geral
      const reasoning = this.generateGeneralReasoning(userProfile, combinedRecommendations);

      // 5. Calcular confiança geral
      const confidence = this.calculateOverallConfidence([
        collaborative.confidence,
        contentBased.confidence,
        performanceBased.confidence,
        ruleBased.confidence
      ]);

      return {
        userId,
        recommendations: combinedRecommendations,
        confidence,
        reasoning,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Erro ao gerar recomendações:', error);
      throw new Error('Falha ao gerar recomendações');
    }
  }
  */

  /**
   * Recomenda exercícios específicos baseado no músculo alvo
   */
  async recommendExercises(
    userId: string,
    muscleGroup: string,
    limit: number = 10
  ): Promise<ExerciseRecommendation[]> {
    try {
      const userProfile = await this.getUserProfile(userId);
      const performanceHistory = await this.getPerformanceHistory(userId);

      // TODO: Implementar lógica de recomendação de exercícios
      // Por enquanto retorna array vazio
      return [];
    } catch (error) {
      console.error('Erro ao recomendar exercícios:', error);
      return [];
    }
  }

  // ============================================================================
  // ALGORITMOS ORIGINAIS - COMENTADOS PARA MVP v0.01
  // ============================================================================

  // MVP v0.01: Algoritmos complexos desabilitados temporariamente
  // TODO: Reativar na v0.02
  /*
  // ============================================================================
  // ALGORITMO 1: COLLABORATIVE FILTERING
  // ============================================================================

  /**
   * Filtragem Colaborativa - Baseado em usuários similares
   */
  /*
  private async collaborativeFiltering(similarUsers: SimilarUser[]): Promise<CollaborativeFilteringResult> {
    try {
      if (!similarUsers || similarUsers.length === 0) {
        return {
          recommendedMethods: [],
          confidence: 0.3, // Baixa confiança sem usuários similares
          basedOnUsers: 0
        };
      }

      // Agregar métodos bem-sucedidos de usuários similares
      const methodCounts = new Map<string, number>();
      const methodWeights = new Map<string, number>();

      similarUsers.forEach(user => {
        user.successfulMethods.forEach(method => {
          const count = methodCounts.get(method) || 0;
          const weight = methodWeights.get(method) || 0;
          
          methodCounts.set(method, count + 1);
          methodWeights.set(method, weight + user.similarity);
        });
      });

      // Ordenar por peso (similaridade * contagem)
      const sortedMethods = Array.from(methodCounts.entries())
        .map(([method, count]) => ({
          method,
          weight: (methodWeights.get(method) || 0) * count
        }))
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 3)
        .map(item => item.method);

      return {
        recommendedMethods: sortedMethods,
        confidence: Math.min(similarUsers.length / 10, 0.9), // Máximo 0.9
        basedOnUsers: similarUsers.length
      };
    } catch (error) {
      console.error('Erro no collaborative filtering:', error);
      return {
        recommendedMethods: [],
        confidence: 0.3,
        basedOnUsers: 0
      };
    }
  }

  // ============================================================================
  // ALGORITMO 2: CONTENT-BASED FILTERING
  // ============================================================================

  /**
   * Filtragem Baseada em Conteúdo - Baseado no perfil do usuário
   */
  private async contentBasedFiltering(userProfile: UserProfile): Promise<ContentBasedResult> {
    try {
      const preferences = {
        fitnessLevel: userProfile.fitnessData.fitnessLevel,
        primaryGoals: userProfile.goals.primary,
        secondaryGoals: userProfile.goals.secondary,
        availableDays: userProfile.availability.daysPerWeek,
        availableTime: userProfile.availability.minutesPerSession,
        equipment: userProfile.equipment,
        preferences: {
          intensity: this.determineIntensity(userProfile.fitnessData.fitnessLevel),
          exerciseVariety: 'Média',
          restDays: 7 - userProfile.availability.daysPerWeek
        },
        constraints: {
          injuries: userProfile.medicalHistory.injuries,
          timeConstraints: [],
          otherConstraints: userProfile.medicalHistory.limitations
        }
      };

      const suggestedMethods = trainingMethodService.suggestBasedOnUserPreferences(preferences);
      
      return {
        recommendedMethods: suggestedMethods.map(m => m.name),
        confidence: 0.85, // Alta confiança em dados de perfil
        matchedFeatures: [
          'Dias disponíveis',
          'Objetivos',
          'Nível de experiência',
          'Equipamentos'
        ]
      };
    } catch (error) {
      console.error('Erro no content-based filtering:', error);
      return {
        recommendedMethods: [],
        confidence: 0.5,
        matchedFeatures: []
      };
    }
  }

  // ============================================================================
  // ALGORITMO 3: PERFORMANCE-BASED FILTERING
  // ============================================================================

  /**
   * Filtragem Baseada em Performance - Baseado no histórico
   */
  private async performanceBasedFiltering(performanceHistory: PerformanceData[]): Promise<PerformanceBasedResult> {
    try {
      if (!performanceHistory || performanceHistory.length === 0) {
        return {
          recommendedMethods: [],
          confidence: 0.4, // Confiança média sem histórico
          basedOnMetrics: []
        };
      }

      // Analisar métricas de performance
      const completionRate = this.calculateCompletionRate(performanceHistory);
      const progressionRate = this.calculateProgressionRate(performanceHistory);
      const consistencyScore = this.calculateConsistencyScore(performanceHistory);

      // Decidir recomendações baseadas em performance
      const recommendedMethods: string[] = [];
      const basedOnMetrics: string[] = [];

      // Se alta consistência e progressão, recomendar métodos avançados
      if (completionRate > 0.8 && progressionRate > 0.7) {
        recommendedMethods.push('PPL (Push/Pull/Legs)', 'Bro Split');
        basedOnMetrics.push('Alta consistência', 'Boa progressão');
      }
      // Se média consistência, recomendar métodos intermediários
      else if (completionRate > 0.6) {
        recommendedMethods.push('Upper/Lower', 'Full Body');
        basedOnMetrics.push('Consistência moderada');
      }
      // Se baixa consistência, recomendar métodos simples
      else {
        recommendedMethods.push('Full Body');
        basedOnMetrics.push('Precisa melhorar consistência');
      }

      return {
        recommendedMethods,
        confidence: 0.75,
        basedOnMetrics
      };
    } catch (error) {
      console.error('Erro no performance-based filtering:', error);
      return {
        recommendedMethods: [],
        confidence: 0.4,
        basedOnMetrics: []
      };
    }
  }

  // ============================================================================
  // ALGORITMO 4: RULE-BASED FILTERING
  // ============================================================================

  /**
   * Filtragem Baseada em Regras - Regras de negócio
   */
  private async ruleBasedFiltering(userProfile: UserProfile): Promise<RuleBasedResult> {
    try {
      const recommendedMethods: string[] = [];
      const rulesApplied: string[] = [];

      // REGRA 1: Dias disponíveis
      const days = userProfile.availability.daysPerWeek;
      if (days >= 6) {
        recommendedMethods.push('PPL (Push/Pull/Legs)');
        rulesApplied.push('6+ dias → PPL');
      } else if (days >= 4) {
        recommendedMethods.push('Upper/Lower');
        rulesApplied.push('4-5 dias → Upper/Lower');
      } else if (days >= 3) {
        recommendedMethods.push('Full Body');
        rulesApplied.push('3 dias → Full Body');
      }

      // REGRA 2: Nível de experiência
      if (userProfile.fitnessData.fitnessLevel === 'Iniciante') {
        recommendedMethods.push('Full Body');
        rulesApplied.push('Iniciante → Full Body');
      } else if (userProfile.fitnessData.fitnessLevel === 'Avançado' && days >= 5) {
        recommendedMethods.push('Bro Split');
        rulesApplied.push('Avançado + 5 dias → Bro Split');
      }

      // REGRA 3: Objetivo principal
      if (userProfile.goals.primary.includes('Força')) {
        recommendedMethods.push('PHUL (Power Hypertrophy Upper Lower)');
        rulesApplied.push('Objetivo Força → PHUL');
      }

      // REGRA 4: Tempo limitado
      if (userProfile.availability.minutesPerSession < 60) {
        recommendedMethods.push('Full Body');
        rulesApplied.push('Tempo limitado → Full Body');
      }

      // Remover duplicatas
      const uniqueMethods = [...new Set(recommendedMethods)];

      return {
        recommendedMethods: uniqueMethods.slice(0, 3),
        confidence: 0.8,
        rulesApplied
      };
    } catch (error) {
      console.error('Erro no rule-based filtering:', error);
      return {
        recommendedMethods: [],
        confidence: 0.6,
        rulesApplied: []
      };
    }
  }

  // ============================================================================
  // COMBINAÇÃO DE RESULTADOS
  // ============================================================================

  /**
   * Combina resultados dos 4 algoritmos
   */
  private combineRecommendations(
    hybrid: HybridRecommendationResult,
    userProfile: UserProfile
  ): TrainingMethodRecommendation[] {
    // Agregar todos os métodos recomendados com seus pesos
    const methodScores = new Map<string, number>();
    const methodConfidences = new Map<string, number>();
    const methodSources = new Map<string, string[]>();

    // Adicionar métodos do collaborative filtering (peso 0.25)
    hybrid.collaborative.recommendedMethods.forEach(method => {
      const score = methodScores.get(method) || 0;
      methodScores.set(method, score + (hybrid.collaborative.confidence * 25));
      methodSources.set(method, [...(methodSources.get(method) || []), 'usuários similares']);
    });

    // Adicionar métodos do content-based (peso 0.35)
    hybrid.contentBased.recommendedMethods.forEach(method => {
      const score = methodScores.get(method) || 0;
      methodScores.set(method, score + (hybrid.contentBased.confidence * 35));
      methodSources.set(method, [...(methodSources.get(method) || []), 'perfil do usuário']);
    });

    // Adicionar métodos do performance-based (peso 0.20)
    hybrid.performanceBased.recommendedMethods.forEach(method => {
      const score = methodScores.get(method) || 0;
      methodScores.set(method, score + (hybrid.performanceBased.confidence * 20));
      methodSources.set(method, [...(methodSources.get(method) || []), 'histórico de performance']);
    });

    // Adicionar métodos do rule-based (peso 0.20)
    hybrid.ruleBased.recommendedMethods.forEach(method => {
      const score = methodScores.get(method) || 0;
      methodScores.set(method, score + (hybrid.ruleBased.confidence * 20));
      methodSources.set(method, [...(methodSources.get(method) || []), 'regras de treino']);
    });

    // Criar recomendações finais
    const recommendations: TrainingMethodRecommendation[] = [];

    Array.from(methodScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .forEach(([methodName, score]) => {
        const method = trainingMethodService.getMethodByName(methodName);
        if (method) {
          const sources = methodSources.get(methodName) || [];
          const confidence = score / 100;
          
          recommendations.push({
            method,
            score,
            confidence,
            reasoning: this.generateMethodReasoning(method, userProfile, sources),
            pros: method.benefits,
            cons: this.generateCons(method, userProfile),
            alternatives: this.findAlternatives(method, recommendations)
          });
        }
      });

    return recommendations;
  }

  // ============================================================================
  // MÉTODOS AUXILIARES
  // ============================================================================

  private async getUserProfile(userId: string): Promise<UserProfile> {
    // TODO: Buscar perfil real do banco de dados
    // Por enquanto, retorna perfil mock
    return {
      userId,
      demographics: {
        age: 25,
        gender: 'Masculino',
        weight: 75,
        height: 175
      },
      fitnessData: {
        fitnessLevel: 'Intermediário',
        trainingExperience: 2
      },
      goals: {
        primary: ['Hipertrofia', 'Força'],
        secondary: ['Definição']
      },
      availability: {
        daysPerWeek: 5,
        minutesPerSession: 60,
        preferredDays: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']
      },
      equipment: ['Barra', 'Halteres', 'Máquinas'],
      medicalHistory: {
        injuries: [],
        conditions: [],
        limitations: []
      }
    };
  }

  private async getPerformanceHistory(userId: string): Promise<PerformanceData[]> {
    // TODO: Buscar histórico real do banco de dados
    return [];
  }

  private async findSimilarUsers(userId: string): Promise<SimilarUser[]> {
    // TODO: Implementar busca de usuários similares
    return [];
  }

  private calculateCompletionRate(history: PerformanceData[]): number {
    if (history.length === 0) return 0;
    const completed = history.filter(h => h.completed).length;
    return completed / history.length;
  }

  private calculateProgressionRate(history: PerformanceData[]): number {
    // TODO: Implementar cálculo real de progressão
    return 0.7;
  }

  private calculateConsistencyScore(history: PerformanceData[]): number {
    // TODO: Implementar cálculo real de consistência
    return 0.8;
  }

  private determineIntensity(level: string): 'Baixa' | 'Média' | 'Alta' {
    if (level === 'Iniciante') return 'Baixa';
    if (level === 'Intermediário') return 'Média';
    return 'Alta';
  }

  private generateMethodReasoning(method: any, profile: UserProfile, sources: string[]): string {
    return `Recomendado baseado em ${sources.join(', ')}. ${method.description}`;
  }

  private generateCons(method: any, profile: UserProfile): string[] {
    const cons: string[] = [];
    
    if (method.timeRequired > profile.availability.minutesPerSession) {
      cons.push(`Requer ${method.timeRequired} minutos por sessão`);
    }
    
    if (method.difficulty === 'Avançado' && profile.fitnessData.fitnessLevel === 'Iniciante') {
      cons.push('Pode ser desafiador para iniciantes');
    }
    
    return cons;
  }

  private findAlternatives(method: any, currentRecommendations: TrainingMethodRecommendation[]): string[] {
    // Retorna métodos similares que não estão nas recomendações atuais
    const allMethods = trainingMethodService.getAllMethods();
    return allMethods
      .filter(m => m.name !== method.name && m.difficulty === method.difficulty)
      .map(m => m.name)
      .slice(0, 2);
  }

  private generateGeneralReasoning(profile: UserProfile, recommendations: TrainingMethodRecommendation[]): string {
    return `Baseado no seu perfil (${profile.fitnessData.fitnessLevel}, ${profile.availability.daysPerWeek} dias/semana) e objetivos (${profile.goals.primary.join(', ')}), recomendamos os seguintes métodos de treino.`;
  }

  private calculateOverallConfidence(confidences: number[]): number {
    return confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
  }
  */
}

export default new RecommendationEngine();


