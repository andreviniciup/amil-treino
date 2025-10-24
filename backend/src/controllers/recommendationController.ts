import { Request, Response } from 'express';
import recommendationEngine from '../services/recommendationEngine';
import trainingMethodService from '../services/trainingMethodService';

/**
 * Controller de Recomendações
 * 
 * Endpoints para obter recomendações personalizadas de métodos de treino e exercícios
 */
export class RecommendationController {
  /**
   * GET /api/recommendations
   * Obtém recomendações gerais para o usuário
   */
  async getRecommendations(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || req.query.userId as string;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório'
        });
      }

      const recommendations = await recommendationEngine.generateRecommendations(userId);
      
      res.json({
        success: true,
        data: recommendations
      });
    } catch (error) {
      console.error('Erro ao obter recomendações:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao gerar recomendações'
      });
    }
  }

  /**
   * GET /api/recommendations/methods
   * Obtém recomendações de métodos de treino baseado em parâmetros
   */
  async getMethodRecommendations(req: Request, res: Response) {
    try {
      const { days, goals } = req.query;
      
      if (!days) {
        return res.status(400).json({
          success: false,
          error: 'Número de dias é obrigatório'
        });
      }

      const availableDays = parseInt(days as string);
      const userGoals = goals ? (goals as string).split(',') : [];
      
      const methods = trainingMethodService.suggestTrainingMethods(
        availableDays,
        userGoals as any[]
      );
      
      res.json({
        success: true,
        data: {
          methods,
          count: methods.length,
          parameters: {
            availableDays,
            goals: userGoals
          }
        }
      });
    } catch (error) {
      console.error('Erro ao recomendar métodos:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao recomendar métodos de treino'
      });
    }
  }

  /**
   * GET /api/recommendations/exercises
   * Obtém recomendações de exercícios para um grupo muscular
   */
  async getExerciseRecommendations(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || req.query.userId as string;
      const { muscleGroup, limit } = req.query;
      
      if (!userId || !muscleGroup) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário e grupo muscular são obrigatórios'
        });
      }

      const recommendations = await recommendationEngine.recommendExercises(
        userId,
        muscleGroup as string,
        limit ? parseInt(limit as string) : 10
      );
      
      res.json({
        success: true,
        data: recommendations
      });
    } catch (error) {
      console.error('Erro ao recomendar exercícios:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao recomendar exercícios'
      });
    }
  }

  /**
   * GET /api/recommendations/methods/all
   * Obtém todos os métodos de treino disponíveis
   */
  async getAllMethods(req: Request, res: Response) {
    try {
      const methods = trainingMethodService.getAllMethods();
      
      res.json({
        success: true,
        data: methods,
        count: methods.length
      });
    } catch (error) {
      console.error('Erro ao obter métodos:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao obter métodos de treino'
      });
    }
  }

  /**
   * GET /api/recommendations/methods/:name
   * Obtém detalhes de um método específico
   */
  async getMethodByName(req: Request, res: Response) {
    try {
      const { name } = req.params;
      
      const method = trainingMethodService.getMethodByName(name);
      
      if (!method) {
        return res.status(404).json({
          success: false,
          error: 'Método não encontrado'
        });
      }
      
      res.json({
        success: true,
        data: method
      });
    } catch (error) {
      console.error('Erro ao obter método:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao obter método de treino'
      });
    }
  }
}

export default new RecommendationController();


