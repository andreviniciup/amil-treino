import { Request, Response } from 'express';
import gamificationService from '../services/gamificationService';
import badgeService from '../services/badgeService';

export class GamificationController {
  async getScore(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || req.query.userId as string;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório'
        });
      }

      const score = await gamificationService.calculateUserScore(userId);

      res.json({
        success: true,
        data: score
      });
    } catch (error) {
      console.error('Erro ao buscar score:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao buscar score'
      });
    }
  }

  async getBadges(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || req.query.userId as string;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório'
        });
      }

      const badges = await badgeService.getUserBadges(userId);

      res.json({
        success: true,
        data: badges,
        count: badges.length
      });
    } catch (error) {
      console.error('Erro ao buscar badges:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao buscar badges'
      });
    }
  }

  async checkBadges(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || req.body.userId;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID do usuário é obrigatório'
        });
      }

      const newBadges = await badgeService.checkAndAwardBadges(userId);

      res.json({
        success: true,
        data: {
          newBadges,
          count: newBadges.length
        }
      });
    } catch (error) {
      console.error('Erro ao verificar badges:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao verificar badges'
      });
    }
  }
}

export default new GamificationController();


