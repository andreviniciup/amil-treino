/**
 * Tipos e Interfaces para Sistema de Recomendação
 */

// ============================================================================
// TIPOS PRINCIPAIS
// ============================================================================

export interface TrainingMethod {
  id?: string;
  name: string;
  description: string;
  minDays: number;
  maxDays: number;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  goals: string[]; // Objetivos compatíveis
  equipment: string[]; // Equipamentos necessários
  timeRequired: number; // Tempo médio por sessão (minutos)
  split: string[]; // Divisão dos treinos (ex: ['Push', 'Pull', 'Legs'])
  benefits: string[]; // Benefícios do método
  isActive?: boolean;
  createdAt?: Date;
}

export interface UserPreferences {
  fitnessLevel: 'Iniciante' | 'Intermediário' | 'Avançado';
  primaryGoals: string[]; // Ex: ['Hipertrofia', 'Força']
  secondaryGoals: string[]; // Ex: ['Perda de Peso', 'Definição']
  availableDays: number; // Dias disponíveis para treinar
  availableTime: number; // Minutos disponíveis por sessão
  equipment: string[]; // Equipamentos disponíveis
  preferences: {
    intensity: 'Baixa' | 'Média' | 'Alta';
    exerciseVariety: 'Baixa' | 'Média' | 'Alta';
    restDays: number; // Dias de descanso preferidos por semana
  };
  constraints: {
    injuries: string[]; // Lesões ou limitações
    timeConstraints: string[]; // Restrições de tempo
    otherConstraints: string[]; // Outras restrições
  };
}

export interface RecommendationResult {
  userId: string;
  recommendations: TrainingMethodRecommendation[];
  confidence: number; // Confiança geral do sistema (0-1)
  reasoning: string; // Explicação geral
  timestamp: Date;
}

export interface TrainingMethodRecommendation {
  method: TrainingMethod;
  score: number; // Pontuação de adequação (0-100)
  confidence: number; // Confiança na recomendação (0-1)
  reasoning: string; // Explicação da recomendação
  pros: string[]; // Vantagens para o usuário
  cons: string[]; // Desvantagens ou considerações
  alternatives: string[]; // IDs de métodos alternativos
}

export interface ExerciseRecommendation {
  exerciseId: string;
  exerciseName: string;
  bodyPart: string;
  equipment: string;
  score: number; // Pontuação de adequação (0-100)
  confidence: number; // Confiança na recomendação (0-1)
  reasoning: string; // Por que este exercício é recomendado
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  alternatives: string[]; // IDs de exercícios alternativos
  scientificSupport?: {
    studies: number;
    effectSize: number;
    evidenceLevel: 'A' | 'B' | 'C';
  };
}

// ============================================================================
// TIPOS PARA ANÁLISE DE PERFIL
// ============================================================================

export interface UserProfile {
  userId: string;
  demographics: {
    age: number;
    gender: 'Masculino' | 'Feminino' | 'Outro';
    weight: number;
    height: number;
  };
  fitnessData: {
    fitnessLevel: 'Iniciante' | 'Intermediário' | 'Avançado';
    trainingExperience: number; // Anos de experiência
    currentProgram?: string;
  };
  goals: {
    primary: string[];
    secondary: string[];
    targetDate?: Date;
  };
  availability: {
    daysPerWeek: number;
    minutesPerSession: number;
    preferredDays: string[];
  };
  equipment: string[];
  medicalHistory: {
    injuries: string[];
    conditions: string[];
    limitations: string[];
  };
}

// ============================================================================
// TIPOS PARA ENGINE DE RECOMENDAÇÃO
// ============================================================================

export interface RecommendationInput {
  userProfile: UserProfile;
  performanceHistory?: PerformanceData[];
  similarUsers?: SimilarUser[];
  context?: RecommendationContext;
}

export interface PerformanceData {
  userId: string;
  exerciseId: string;
  date: Date;
  metrics: {
    weight?: number;
    reps?: number;
    sets?: number;
    duration?: number; // segundos
    rpe?: number; // Rate of Perceived Exertion (1-10)
  };
  completed: boolean;
  notes?: string;
}

export interface SimilarUser {
  userId: string;
  similarity: number; // 0-1
  sharedCharacteristics: string[];
  successfulMethods: string[];
}

export interface RecommendationContext {
  currentPhase: 'onboarding' | 'active' | 'recovery' | 'deload';
  recentPerformance: 'improving' | 'plateau' | 'declining';
  adherence: number; // 0-1
  motivation: 'high' | 'medium' | 'low';
}

// ============================================================================
// TIPOS PARA ALGORITMOS DE RECOMENDAÇÃO
// ============================================================================

export interface CollaborativeFilteringResult {
  recommendedMethods: string[];
  confidence: number;
  basedOnUsers: number; // Quantidade de usuários similares analisados
}

export interface ContentBasedResult {
  recommendedMethods: string[];
  confidence: number;
  matchedFeatures: string[]; // Features que deram match
}

export interface PerformanceBasedResult {
  recommendedMethods: string[];
  confidence: number;
  basedOnMetrics: string[]; // Métricas usadas para recomendação
}

export interface RuleBasedResult {
  recommendedMethods: string[];
  confidence: number;
  rulesApplied: string[]; // Regras que foram aplicadas
}

export interface HybridRecommendationResult {
  collaborative: CollaborativeFilteringResult;
  contentBased: ContentBasedResult;
  performanceBased: PerformanceBasedResult;
  ruleBased: RuleBasedResult;
  combined: TrainingMethodRecommendation[];
}

// ============================================================================
// TIPOS PARA FEEDBACK E APRENDIZADO
// ============================================================================

export interface UserFeedback {
  id?: string;
  userId: string;
  recommendationId: string;
  rating: number; // 1-5 estrelas
  feedback?: string;
  isHelpful: boolean;
  action: 'accepted' | 'rejected' | 'modified';
  timestamp: Date;
}

export interface RecommendationMetrics {
  recommendationId: string;
  accuracy: number; // Precisão (0-1)
  userSatisfaction: number; // Satisfação do usuário (1-5)
  adoptionRate: number; // Taxa de adoção (0-1)
  completionRate: number; // Taxa de conclusão (0-1)
}

// ============================================================================
// TIPOS PARA MÉTODOS DE TREINO ESPECÍFICOS
// ============================================================================

export interface PPLMethod extends TrainingMethod {
  name: 'PPL (Push/Pull/Legs)';
  split: ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs'];
  focusAreas: {
    push: string[]; // Ex: ['Peito', 'Ombros', 'Tríceps']
    pull: string[]; // Ex: ['Costas', 'Bíceps']
    legs: string[]; // Ex: ['Pernas', 'Glúteos']
  };
}

export interface UpperLowerMethod extends TrainingMethod {
  name: 'Upper/Lower';
  split: ['Upper', 'Lower', 'Upper', 'Lower'];
  focusAreas: {
    upper: string[]; // Ex: ['Peito', 'Costas', 'Ombros', 'Braços']
    lower: string[]; // Ex: ['Pernas', 'Glúteos']
  };
}

export interface FullBodyMethod extends TrainingMethod {
  name: 'Full Body';
  split: ['Full Body', 'Full Body', 'Full Body'];
  focusAreas: {
    fullBody: string[]; // Todos os grupos musculares
  };
}

export interface BroSplitMethod extends TrainingMethod {
  name: 'Bro Split';
  split: ['Peito', 'Costas', 'Pernas', 'Ombros', 'Braços'];
  focusAreas: {
    chest: string[];
    back: string[];
    legs: string[];
    shoulders: string[];
    arms: string[];
  };
}

// ============================================================================
// TIPOS AUXILIARES
// ============================================================================

export type DayOfWeek = 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado' | 'Domingo';

export type TrainingGoal = 
  | 'Hipertrofia'
  | 'Força'
  | 'Resistência'
  | 'Definição'
  | 'Perda de Peso'
  | 'Condicionamento'
  | 'Reabilitação'
  | 'Performance';

export type EquipmentType = 
  | 'Barra'
  | 'Halteres'
  | 'Máquinas'
  | 'Peso Corporal'
  | 'Elásticos'
  | 'Kettlebell'
  | 'TRX'
  | 'Bola Suíça';

export type FitnessLevel = 'Iniciante' | 'Intermediário' | 'Avançado';


