/**
 * Tipos para Dados Científicos e Sistema de ML
 */

// ============================================================================
// TIPOS DE DADOS CIENTÍFICOS
// ============================================================================

export interface ScientificDataset {
  exercises: ScientificExerciseData[];
  performance: PerformanceStudyData[];
  goals: GoalData[];
  methods: TrainingMethodData[];
  metadata: DatasetMetadata;
}

export interface ScientificExerciseData {
  id: string;
  name: string;
  nameEnglish: string;
  muscleGroups: string[];
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string[];
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  biomechanics: BiomechanicsData;
  scientificEvidence: ScientificEvidence;
  effectivenessScore: number; // 0-100
  injuryRisk: number; // 0-10
}

export interface BiomechanicsData {
  jointAngles: {
    joint: string;
    angleRange: [number, number];
  }[];
  forceVectors: {
    direction: string;
    magnitude: number;
  }[];
  muscleActivation: Record<string, number>; // % de ativação por músculo
  movementPattern: string;
  rangeOfMotion: string;
}

export interface ScientificEvidence {
  studies: number; // Número de estudos
  participants: number; // Total de participantes nos estudos
  effectSize: number; // Tamanho do efeito (Cohen's d)
  confidence: number; // Nível de confiança (0-1)
  evidenceLevel: 'A' | 'B' | 'C' | 'D'; // A = mais forte
  metaAnalysis: boolean;
  sources: string[]; // URLs ou DOIs dos estudos
}

export interface PerformanceStudyData {
  exerciseId: string;
  population: PopulationData;
  methodology: StudyMethodology;
  outcomes: PerformanceOutcomes;
  statisticalSignificance: number; // p-value
}

export interface PopulationData {
  type: 'untrained' | 'trained' | 'elite' | 'mixed';
  sampleSize: number;
  demographics: {
    ageRange: [number, number];
    genderDistribution: {
      male: number;
      female: number;
    };
    averageWeight: number;
    averageHeight: number;
    averageBodyFat: number;
  };
}

export interface StudyMethodology {
  duration: number; // semanas
  frequency: number; // sessões por semana
  volume: {
    sets: number;
    reps: string; // ex: "8-12"
    intensity: number; // % de 1RM
  };
  controlGroup: boolean;
  randomization: boolean;
  blinding: boolean;
}

export interface PerformanceOutcomes {
  strengthGains: {
    average: number; // % de ganho
    standardDeviation: number;
    range: [number, number];
  };
  muscleGrowth: {
    average: number; // % de aumento
    standardDeviation: number;
    measurementMethod: string;
  };
  enduranceImprovement: {
    average: number; // %
    standardDeviation: number;
  };
  timeToPeak: number; // semanas até ganhos máximos
  retentionRate: number; // % de ganhos mantidos após destreino
}

export interface GoalData {
  goalType: string;
  population: string;
  recommendedMethods: string[];
  expectedOutcomes: ExpectedOutcomes;
  scientificSupport: ScientificEvidence;
  timeframe: {
    minimum: number; // semanas
    optimal: number; // semanas
    maximum: number; // semanas
  };
}

export interface ExpectedOutcomes {
  successRate: number; // % de pessoas que alcançam o objetivo
  averageProgress: number; // % de progresso médio
  keyFactors: string[];
  commonBarriers: string[];
}

export interface TrainingMethodData {
  methodName: string;
  scientificBasis: string;
  effectiveness: Record<string, number>; // Efetividade por objetivo (0-100)
  adherenceRate: number; // Taxa de aderência (0-1)
  dropoutRate: number; // Taxa de desistência (0-1)
  optimalPopulation: string[];
  contraindications: string[];
  modifications: MethodModification[];
}

export interface MethodModification {
  condition: string;
  modification: string;
  reasoning: string;
}

export interface DatasetMetadata {
  version: string;
  createdAt: Date;
  lastUpdated: Date;
  sources: DataSource[];
  totalStudies: number;
  totalParticipants: number;
  qualityScore: number; // 0-100
}

export interface DataSource {
  type: 'paper' | 'meta-analysis' | 'database' | 'api';
  name: string;
  url?: string;
  doi?: string;
  accessDate: Date;
  reliability: number; // 0-1
}

// ============================================================================
// TIPOS PARA MACHINE LEARNING
// ============================================================================

export interface MLTrainingDataset {
  features: MLFeatures;
  labels: MLLabels;
  metadata: MLMetadata;
}

export interface MLFeatures {
  userProfile: UserProfileFeatures;
  exerciseProperties: ExercisePropertyFeatures;
  trainingHistory: TrainingHistoryFeatures;
  environmentalFactors: EnvironmentalFeatures;
}

export interface UserProfileFeatures {
  age: number;
  gender: number; // Encoded: 0=M, 1=F, 2=Other
  weight: number;
  height: number;
  bmi: number;
  fitnessLevel: number; // Encoded: 0=Iniciante, 1=Inter, 2=Avançado
  trainingExperience: number; // anos
  goalsVector: number[]; // One-hot encoding dos objetivos
  equipmentVector: number[]; // One-hot encoding dos equipamentos
  availableTime: number;
  availableDays: number;
  injuryHistory: number[]; // Encoded injuries
}

export interface ExercisePropertyFeatures {
  difficultyScore: number; // 0-1
  equipmentRequirement: number[]; // One-hot
  muscleActivationVector: number[]; // Ativação por grupo muscular
  biomechanicalComplexity: number; // 0-1
  injuryRiskScore: number; // 0-1
  effectivenessScore: number; // 0-1
  scientificSupportScore: number; // 0-1
}

export interface TrainingHistoryFeatures {
  totalWorkouts: number;
  averageFrequency: number; // por semana
  consistencyScore: number; // 0-1
  progressionRate: number; // % de melhora
  adherenceRate: number; // 0-1
  preferredExercises: number[]; // IDs dos exercícios mais usados
  performanceTrend: number; // -1 a 1 (declining to improving)
}

export interface EnvironmentalFeatures {
  seasonality: number; // 0-3 (seasons)
  timeOfDay: number; // 0-23 (hours)
  locationVector: number[]; // casa, academia, parque
  socialSupport: number; // 0-1
}

export interface MLLabels {
  exerciseRecommendations: ExerciseLabel[];
  methodRecommendations: MethodLabel[];
  progressionRecommendations: ProgressionLabel[];
  recoveryRecommendations: RecoveryLabel[];
}

export interface ExerciseLabel {
  exerciseId: string;
  recommendationScore: number; // 0-1
  expectedEffectiveness: number; // 0-1
  expectedAdherence: number; // 0-1
  scientificConfidence: number; // 0-1
}

export interface MethodLabel {
  methodName: string;
  recommendationScore: number; // 0-1
  expectedSuccess: number; // 0-1
  expectedAdherence: number; // 0-1
  scientificConfidence: number; // 0-1
}

export interface ProgressionLabel {
  nextWeight: number;
  nextReps: number;
  nextSets: number;
  deloadRecommendation: boolean;
  confidence: number; // 0-1
}

export interface RecoveryLabel {
  recommendedRestDays: number;
  deloadWeekRecommended: boolean;
  recoveryScore: number; // 0-1
}

export interface MLMetadata {
  datasetVersion: string;
  trainingDate: Date;
  modelVersion: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  validationSplit: number;
  testSplit: number;
}

// ============================================================================
// TIPOS PARA PIPELINE DE DADOS
// ============================================================================

export interface ExtractedData {
  exercises: ScientificExerciseData[];
  trainingMethods: TrainingMethodData[];
  performanceData: PerformanceStudyData[];
  recommendations: RecommendationData[];
}

export interface RecommendationData {
  context: string;
  recommendation: string;
  scientificBasis: string;
  confidence: number;
}

export interface PipelineResult {
  success: boolean;
  models: TrainedModel[];
  validation: ValidationResult;
  dataQuality: DataQualityMetrics;
  scientificSupport: ScientificSupportMetrics;
  timestamp: Date;
}

export interface TrainedModel {
  modelType: string;
  modelVersion: string;
  accuracy: number;
  trainingTime: number;
  parameters: Record<string, any>;
  filePath: string;
}

export interface ValidationResult {
  crossValidationScore: number;
  testAccuracy: number;
  confusionMatrix: number[][];
  rocAuc: number;
  featureImportance: Record<string, number>;
}

export interface DataQualityMetrics {
  completeness: number; // 0-1
  consistency: number; // 0-1
  accuracy: number; // 0-1
  timeliness: number; // 0-1
  relevance: number; // 0-1
  overallScore: number; // 0-1
}

export interface ScientificSupportMetrics {
  totalStudies: number;
  averageQuality: number; // 0-100
  evidenceLevelDistribution: Record<string, number>;
  metaAnalysesCount: number;
  recentStudies: number; // últimos 5 anos
  overallConfidence: number; // 0-1
}

// ============================================================================
// TIPOS PARA APIs CIENTÍFICAS
// ============================================================================

export interface PubMedArticle {
  pmid: string;
  title: string;
  abstract: string;
  authors: string[];
  journal: string;
  publicationDate: Date;
  doi?: string;
  keywords: string[];
  meshTerms: string[];
}

export interface CrossRefArticle {
  doi: string;
  title: string;
  authors: string[];
  journal: string;
  publicationDate: Date;
  abstract?: string;
  citations: number;
  references: string[];
}

export interface ScientificQuery {
  keywords: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  minCitations?: number;
  journals?: string[];
  authors?: string[];
  limit?: number;
}

export interface ScientificSearchResult {
  articles: (PubMedArticle | CrossRefArticle)[];
  totalResults: number;
  query: ScientificQuery;
  searchDate: Date;
}


