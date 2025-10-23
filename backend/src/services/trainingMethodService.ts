import { TrainingMethod, UserPreferences, TrainingGoal } from '../types/recommendation';

/**
 * Serviço de Métodos de Treino
 * 
 * Responsável por sugerir métodos de treino baseados em:
 * - Dias disponíveis
 * - Objetivos do usuário
 * - Nível de experiência
 * - Equipamentos disponíveis
 */
export class TrainingMethodService {
  // ============================================================================
  // MÉTODOS DE TREINO DISPONÍVEIS
  // ============================================================================

  private readonly TRAINING_METHODS: TrainingMethod[] = [
    {
      name: 'PPL (Push/Pull/Legs)',
      description: '3 dias de treino, 2x por semana. Divisão por padrões de movimento.',
      minDays: 6,
      maxDays: 6,
      difficulty: 'Intermediário',
      goals: ['Hipertrofia', 'Força', 'Definição'],
      equipment: ['Barra', 'Halteres', 'Máquinas'],
      timeRequired: 60,
      split: ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs'],
      benefits: [
        'Alto volume de treino',
        'Recuperação adequada entre sessões',
        'Foco específico por grupo muscular',
        'Ideal para hipertrofia'
      ],
      isActive: true
    },
    {
      name: 'Upper/Lower',
      description: '2 dias superiores, 2 dias inferiores. Treino equilibrado.',
      minDays: 4,
      maxDays: 6,
      difficulty: 'Intermediário',
      goals: ['Hipertrofia', 'Força', 'Condicionamento'],
      equipment: ['Barra', 'Halteres', 'Máquinas'],
      timeRequired: 60,
      split: ['Upper', 'Lower', 'Upper', 'Lower'],
      benefits: [
        'Equilíbrio entre parte superior e inferior',
        'Boa recuperação muscular',
        'Volume moderado',
        'Flexível para 4-6 dias'
      ],
      isActive: true
    },
    {
      name: 'Full Body',
      description: 'Treino completo 3x por semana. Todos os grupos musculares por sessão.',
      minDays: 3,
      maxDays: 4,
      difficulty: 'Iniciante',
      goals: ['Hipertrofia', 'Força', 'Condicionamento', 'Perda de Peso'],
      equipment: ['Barra', 'Halteres', 'Peso Corporal'],
      timeRequired: 60,
      split: ['Full Body', 'Full Body', 'Full Body'],
      benefits: [
        'Alta frequência de treino por músculo',
        'Simplicidade e facilidade',
        'Ideal para iniciantes',
        'Eficiente em tempo'
      ],
      isActive: true
    },
    {
      name: 'Bro Split',
      description: '1 grupo muscular por dia, 5 dias por semana.',
      minDays: 5,
      maxDays: 6,
      difficulty: 'Avançado',
      goals: ['Hipertrofia', 'Definição'],
      equipment: ['Barra', 'Halteres', 'Máquinas'],
      timeRequired: 75,
      split: ['Peito', 'Costas', 'Pernas', 'Ombros', 'Braços'],
      benefits: [
        'Foco total em um grupo muscular',
        'Alto volume por sessão',
        'Boa recuperação entre sessões do mesmo músculo',
        'Popular e tradicional'
      ],
      isActive: true
    },
    {
      name: 'Upper/Lower + PPL Híbrido',
      description: 'Combinação de Upper/Lower e PPL para máxima eficiência.',
      minDays: 5,
      maxDays: 6,
      difficulty: 'Avançado',
      goals: ['Hipertrofia', 'Força', 'Performance'],
      equipment: ['Barra', 'Halteres', 'Máquinas'],
      timeRequired: 65,
      split: ['Upper', 'Lower', 'Push', 'Pull', 'Legs'],
      benefits: [
        'Versatilidade máxima',
        'Alto volume total',
        'Variedade de estímulos',
        'Para atletas avançados'
      ],
      isActive: true
    },
    {
      name: 'PHUL (Power Hypertrophy Upper Lower)',
      description: '2 dias de força, 2 dias de hipertrofia. Divisão upper/lower.',
      minDays: 4,
      maxDays: 4,
      difficulty: 'Intermediário',
      goals: ['Hipertrofia', 'Força'],
      equipment: ['Barra', 'Halteres', 'Máquinas'],
      timeRequired: 70,
      split: ['Upper Power', 'Lower Power', 'Upper Hypertrophy', 'Lower Hypertrophy'],
      benefits: [
        'Desenvolve força E tamanho',
        'Variedade de estímulos',
        'Bem estruturado',
        'Resultados comprovados'
      ],
      isActive: true
    },
    {
      name: 'Full Body Split (5x/semana)',
      description: 'Treino completo 5 dias, com foco alternado.',
      minDays: 5,
      maxDays: 5,
      difficulty: 'Avançado',
      goals: ['Hipertrofia', 'Condicionamento', 'Performance'],
      equipment: ['Barra', 'Halteres', 'Máquinas', 'Peso Corporal'],
      timeRequired: 55,
      split: ['Full A', 'Full B', 'Full C', 'Full D', 'Full E'],
      benefits: [
        'Alta frequência por músculo',
        'Variedade constante',
        'Excelente para condicionamento',
        'Máxima adaptação'
      ],
      isActive: true
    }
  ];

  // ============================================================================
  // MÉTODOS PRINCIPAIS
  // ============================================================================

  /**
   * Sugere métodos de treino baseado nos dias disponíveis e objetivos
   */
  suggestTrainingMethods(availableDays: number, goals: TrainingGoal[]): TrainingMethod[] {
    const methods: TrainingMethod[] = [];

    // Filtrar métodos compatíveis com dias disponíveis
    const compatibleMethods = this.TRAINING_METHODS.filter(method => 
      availableDays >= method.minDays && availableDays <= method.maxDays
    );

    // Pontuar métodos baseado em objetivos
    const scoredMethods = compatibleMethods.map(method => {
      const score = this.calculateMethodScore(method, goals);
      return { method, score };
    });

    // Ordenar por pontuação e retornar top 3
    const sortedMethods = scoredMethods
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.method);

    return sortedMethods;
  }

  /**
   * Sugere métodos baseado em perfil completo do usuário
   */
  suggestBasedOnUserPreferences(preferences: UserPreferences): TrainingMethod[] {
    let compatibleMethods = this.TRAINING_METHODS.filter(method => {
      // Filtrar por dias disponíveis
      const daysCompatible = preferences.availableDays >= method.minDays && 
                             preferences.availableDays <= method.maxDays;
      
      // Filtrar por tempo disponível
      const timeCompatible = preferences.availableTime >= method.timeRequired - 10; // 10 min de margem
      
      // Filtrar por nível de experiência
      const levelCompatible = this.isLevelCompatible(method.difficulty, preferences.fitnessLevel);
      
      // Filtrar por equipamento
      const equipmentCompatible = this.hasRequiredEquipment(method.equipment, preferences.equipment);
      
      return daysCompatible && timeCompatible && levelCompatible && equipmentCompatible;
    });

    // Se não houver métodos compatíveis, relaxar restrições
    if (compatibleMethods.length === 0) {
      compatibleMethods = this.TRAINING_METHODS.filter(method => 
        preferences.availableDays >= method.minDays && preferences.availableDays <= method.maxDays
      );
    }

    // Pontuar métodos
    const scoredMethods = compatibleMethods.map(method => {
      const score = this.calculateDetailedScore(method, preferences);
      return { method, score };
    });

    // Ordenar e retornar top 3
    return scoredMethods
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.method);
  }

  /**
   * Obtém método específico por nome
   */
  getMethodByName(name: string): TrainingMethod | undefined {
    return this.TRAINING_METHODS.find(method => method.name === name);
  }

  /**
   * Obtém todos os métodos disponíveis
   */
  getAllMethods(): TrainingMethod[] {
    return this.TRAINING_METHODS.filter(method => method.isActive);
  }

  /**
   * Obtém métodos por dificuldade
   */
  getMethodsByDifficulty(difficulty: 'Iniciante' | 'Intermediário' | 'Avançado'): TrainingMethod[] {
    return this.TRAINING_METHODS.filter(method => method.difficulty === difficulty);
  }

  // ============================================================================
  // MÉTODOS AUXILIARES
  // ============================================================================

  /**
   * Calcula pontuação de um método baseado nos objetivos
   */
  private calculateMethodScore(method: TrainingMethod, goals: TrainingGoal[]): number {
    let score = 0;
    
    // Pontuar por compatibilidade com objetivos
    goals.forEach(goal => {
      if (method.goals.includes(goal)) {
        score += 10;
      }
    });
    
    return score;
  }

  /**
   * Calcula pontuação detalhada baseada em preferências completas
   */
  private calculateDetailedScore(method: TrainingMethod, preferences: UserPreferences): number {
    let score = 0;

    // Pontuação por objetivos primários (peso 3)
    preferences.primaryGoals.forEach(goal => {
      if (method.goals.includes(goal)) {
        score += 30;
      }
    });

    // Pontuação por objetivos secundários (peso 1)
    preferences.secondaryGoals.forEach(goal => {
      if (method.goals.includes(goal)) {
        score += 10;
      }
    });

    // Pontuação por compatibilidade de dias (peso 2)
    if (preferences.availableDays === method.minDays) {
      score += 20; // Perfeito match
    } else if (preferences.availableDays >= method.minDays && preferences.availableDays <= method.maxDays) {
      score += 15; // Dentro do range
    }

    // Pontuação por tempo (peso 1)
    if (preferences.availableTime >= method.timeRequired) {
      score += 10;
    }

    // Pontuação por nível (peso 2)
    if (method.difficulty === preferences.fitnessLevel) {
      score += 20; // Match perfeito
    } else if (this.isLevelCompatible(method.difficulty, preferences.fitnessLevel)) {
      score += 10; // Compatível mas não ideal
    }

    // Pontuação por intensidade preferida (peso 1)
    if (preferences.preferences.intensity === 'Alta' && method.difficulty === 'Avançado') {
      score += 10;
    } else if (preferences.preferences.intensity === 'Média' && method.difficulty === 'Intermediário') {
      score += 10;
    } else if (preferences.preferences.intensity === 'Baixa' && method.difficulty === 'Iniciante') {
      score += 10;
    }

    return score;
  }

  /**
   * Verifica se o nível é compatível
   */
  private isLevelCompatible(methodLevel: string, userLevel: string): boolean {
    const levels = ['Iniciante', 'Intermediário', 'Avançado'];
    const methodIndex = levels.indexOf(methodLevel);
    const userIndex = levels.indexOf(userLevel);
    
    // Usuário pode fazer métodos do seu nível ou um nível abaixo
    return methodIndex <= userIndex || methodIndex === userIndex + 1;
  }

  /**
   * Verifica se o usuário tem os equipamentos necessários
   */
  private hasRequiredEquipment(required: string[], available: string[]): boolean {
    // Se não requer equipamento específico
    if (required.length === 0) return true;
    
    // Verifica se tem pelo menos 50% dos equipamentos necessários
    const matches = required.filter(eq => available.includes(eq));
    return matches.length >= required.length * 0.5;
  }

  /**
   * Gera explicação para uma recomendação
   */
  generateRecommendationReasoning(method: TrainingMethod, preferences: UserPreferences): string {
    const reasons: string[] = [];

    // Razão por dias
    if (preferences.availableDays >= method.minDays && preferences.availableDays <= method.maxDays) {
      reasons.push(`Compatível com seus ${preferences.availableDays} dias disponíveis`);
    }

    // Razão por objetivos
    const matchedGoals = preferences.primaryGoals.filter(goal => method.goals.includes(goal));
    if (matchedGoals.length > 0) {
      reasons.push(`Ideal para ${matchedGoals.join(' e ')}`);
    }

    // Razão por nível
    if (method.difficulty === preferences.fitnessLevel) {
      reasons.push(`Adequado para o seu nível (${preferences.fitnessLevel})`);
    }

    // Razão por tempo
    if (method.timeRequired <= preferences.availableTime) {
      reasons.push(`Cabe no seu tempo disponível (${method.timeRequired} min)`);
    }

    return reasons.join('. ') + '.';
  }
}

export default new TrainingMethodService();

