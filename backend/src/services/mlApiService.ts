import axios, { AxiosInstance } from 'axios';

/**
 * Serviço de Integração com ML API (Python) - MVP v0.01
 * 
 * MVP v0.01: ML Service desabilitado - não precisa rodar
 * TODO: Reativar na v0.02
 * 
 * Conecta o backend TypeScript com o serviço Python de ML
 */
export class MLApiService {
  private api: AxiosInstance;
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
    this.api = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000, // 30 segundos
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // ============================================================================
  // RECOMENDAÇÕES - MVP v0.01
  // ============================================================================

  /**
   * Obtém recomendações de métodos de treino usando ML - MVP v0.01
   */
  async getMLRecommendations(userProfile: any): Promise<any> {
    // MVP v0.01: ML Service desabilitado - não precisa rodar
    console.log('MVP v0.01: ML Service desabilitado - usando fallback');
    return this.getFallbackRecommendations(userProfile);
  }

  // MVP v0.01: Fallback simples
  private getFallbackRecommendations(userProfile: any): any {
    return {
      success: false,
      message: "ML Service não disponível no MVP v0.01",
      fallback: true
    };
  }

  // MVP v0.01: Método original comentado
  /*
  async getMLRecommendations(userProfile: any): Promise<any> {
    try {
      const response = await this.api.post('/api/ml/recommendations', userProfile);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao obter recomendações ML:', error.message);
      return null; // Fallback para recomendação baseada em regras
    }
  }
  */

  /**
   * Obtém recomendações de exercícios usando ML - MVP v0.01
   */
  async getMLExerciseRecommendations(
    userProfile: any,
    muscleGroup: string,
    limit: number = 10
  ): Promise<any> {
    // MVP v0.01: ML Service desabilitado - não precisa rodar
    console.log('MVP v0.01: ML Service desabilitado - usando fallback para exercícios');
    return this.getFallbackExerciseRecommendations(muscleGroup, limit);
  }

  // MVP v0.01: Fallback simples para exercícios
  private getFallbackExerciseRecommendations(muscleGroup: string, limit: number): any {
    return {
      success: false,
      message: "ML Service não disponível no MVP v0.01",
      fallback: true,
      muscleGroup,
      limit
    };
  }

  // MVP v0.01: Método original comentado
  /*
  async getMLExerciseRecommendations(
    userProfile: any,
    muscleGroup: string,
    limit: number = 10
  ): Promise<any> {
    try {
      const response = await this.api.post('/api/ml/recommendations/exercises', {
        ...userProfile,
        muscle_group: muscleGroup,
        limit
      });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao obter recomendações de exercícios ML:', error.message);
      return null;
    }
  }
  */

  // ============================================================================
  // PREDIÇÕES - MVP v0.01
  // ============================================================================

  // MVP v0.01: Predições desabilitadas temporariamente
  // TODO: Reativar na v0.02
  /*
  /**
   * Prediz performance futura
   */
  /*
  async predictPerformance(userId: string, exerciseId: string, history: any[]): Promise<any> {
    try {
      const response = await this.api.post('/api/ml/predict/performance', {
        user_id: userId,
        exercise_id: exerciseId,
        history
      });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao prever performance:', error.message);
      return null;
    }
  }

  /**
   * Prediz próxima progressão
   */
  async predictProgression(userId: string, exerciseId: string, history: any[]): Promise<any> {
    try {
      const response = await this.api.post('/api/ml/predict/progression', {
        user_id: userId,
        exercise_id: exerciseId,
        history
      });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao prever progressão:', error.message);
      return null;
    }
  }

  // ============================================================================
  // VALIDAÇÃO CIENTÍFICA
  // ============================================================================

  /**
   * Valida recomendação com base científica
   */
  async validateRecommendation(recommendation: string, context: string): Promise<any> {
    try {
      const response = await this.api.post('/api/ml/scientific/validate', {
        recommendation,
        context
      });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao validar recomendação:', error.message);
      return null;
    }
  }

  /**
   * Busca artigos científicos
   */
  async searchScientificArticles(keywords: string[], limit: number = 10): Promise<any> {
    try {
      const response = await this.api.post('/api/ml/scientific/search', {
        keywords,
        limit
      });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar artigos científicos:', error.message);
      return null;
    }
  }

  // ============================================================================
  // TREINAMENTO
  // ============================================================================

  /**
   * Verifica status dos modelos ML
   */
  async getModelsStatus(): Promise<any> {
    try {
      const response = await this.api.get('/api/ml/train/models/status');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao verificar status dos modelos:', error.message);
      return { error: true, message: error.message };
    }
  }

  /**
   * Treina modelo com dados mock (para desenvolvimento)
   */
  async generateAndTrainMockData(): Promise<any> {
    try {
      const response = await this.api.post('/api/ml/train/generate-mock-data');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao treinar com dados mock:', error.message);
      return null;
    }
  }

  // ============================================================================
  // HEALTH CHECK
  // ============================================================================

  /**
   * Verifica se o serviço ML está disponível
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.api.get('/health');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

export default new MLApiService();


