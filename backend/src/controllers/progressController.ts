import { Request, Response } from 'express';
import performanceAnalyzer from '../services/performanceAnalyzer';
import performanceHistoryService from '../services/performanceHistoryService';
import userProfileService from '../services/userProfileService';

/**
 * Controller de Progresso
 */
export class ProgressController {
  /**
   * GET /api/progress/consistency
   */
  async getConsistency(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || req.query.userId as string;
      const period = (req.query.period as 'week' | 'month' | 'quarter') || 'month';

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório'
        });
      }

      const analysis = await performanceAnalyzer.analyzeConsistency(userId, period);

      res.json({
        success: true,
        data: analysis
      });
    } catch (error) {
      console.error('Erro ao analisar consistência:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao analisar consistência'
      });
    }
  }

  /**
   * GET /api/progress/performance
   */
  async getPerformance(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || req.query.userId as string;
      const exerciseId = req.query.exerciseId as string;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório'
        });
      }

      const analysis = await performanceAnalyzer.analyzeProgression(userId, exerciseId);

      res.json({
        success: true,
        data: analysis
      });
    } catch (error) {
      console.error('Erro ao analisar performance:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao analisar performance'
      });
    }
  }

  /**
   * GET /api/progress/goals
   */
  async getGoals(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || req.query.userId as string;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório'
        });
      }

      const analysis = await performanceAnalyzer.analyzeGoalProgress(userId);

      res.json({
        success: true,
        data: analysis
      });
    } catch (error) {
      console.error('Erro ao analisar objetivos:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao analisar objetivos'
      });
    }
  }

  /**
   * GET /api/progress/history/:exerciseId
   */
  async getHistory(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || req.query.userId as string;
      const { exerciseId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório'
        });
      }

      const history = await performanceHistoryService.getHistory(userId, exerciseId, limit);

      res.json({
        success: true,
        data: history,
        count: history.length
      });
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao buscar histórico'
      });
    }
  }

  /**
   * POST /api/progress/save
   */
  async savePerformance(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || req.body.userId;
      const { exerciseId, weight, reps, sets, duration, rpe, notes } = req.body;

      if (!userId || !exerciseId) {
        return res.status(400).json({
          success: false,
          error: 'userId e exerciseId são obrigatórios'
        });
      }

      const performance = await performanceHistoryService.savePerformance({
        userId,
        exerciseId,
        weight,
        reps,
        sets,
        duration,
        rpe,
        notes
      });

      res.json({
        success: true,
        data: performance
      });
    } catch (error) {
      console.error('Erro ao salvar performance:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao salvar performance'
      });
    }
  }

  /**
   * GET /api/progress/prs/:exerciseId
   */
  async getPersonalRecords(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || req.query.userId as string;
      const { exerciseId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório'
        });
      }

      const prs = await performanceHistoryService.getPersonalRecords(userId, exerciseId);

      res.json({
        success: true,
        data: prs
      });
    } catch (error) {
      console.error('Erro ao buscar PRs:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao buscar PRs'
      });
    }
  }
}

export default new ProgressController();


