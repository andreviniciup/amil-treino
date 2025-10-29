import { Request, Response } from 'express';
import databaseExerciseService from '../services/databaseExerciseService';

export class ExerciseController {
  async getAll(_req: Request, res: Response) {
    try {
      const exercises = await databaseExerciseService.getAllExercises();

      res.json({
        success: true,
        data: exercises,
        count: exercises.length
      });
    } catch (error) {
      console.error('Error in getAll:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch exercises'
      });
    }
  }

  async getByBodyPart(req: Request, res: Response) {
    try {
      const { bodyPart } = req.params;
      const exercises = await databaseExerciseService.getExercisesByBodyPart(bodyPart);
      
      res.json({
        success: true,
        data: exercises,
        count: exercises.length
      });
    } catch (error) {
      console.error(`Error in getByBodyPart for ${req.params.bodyPart}:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch exercises by body part'
      });
    }
  }

  async getByCategory(req: Request, res: Response) {
    try {
      const { category } = req.params;
      const exercises = await databaseExerciseService.getExercisesByEquipment(category);
      
      res.json({
        success: true,
        data: exercises,
        count: exercises.length
      });
    } catch (error) {
      console.error(`Error in getByCategory for ${req.params.category}:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch exercises by category'
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const exercise = await databaseExerciseService.getExerciseById(id);
      
      res.json({
        success: true,
        data: exercise
      });
    } catch (error) {
      console.error(`Error in getById for ${req.params.id}:`, error);
      res.status(404).json({
        success: false,
        error: 'Exercise not found'
      });
    }
  }

  async search(req: Request, res: Response) {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Query parameter "q" is required'
        });
      }

      const exercises = await databaseExerciseService.searchExercises(q);
      
      res.json({
        success: true,
        data: exercises,
        count: exercises.length
      });
    } catch (error) {
      console.error('Error in search:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search exercises'
      });
    }
  }

  async clearCache(_req: Request, res: Response) {
    try {
      // Não há cache para limpar quando usamos banco direto
      res.json({
        success: true,
        message: 'Using direct database queries - no cache to clear'
      });
    } catch (error) {
      console.error('Error in clearCache:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to clear cache'
      });
    }
  }

  async updateImages(_req: Request, res: Response) {
    try {
      // As imagens já vêm da API ao fazer o seed
      res.json({
        success: true,
        message: 'Images are synced during seed process'
      });
    } catch (error) {
      console.error('Error in updateImages:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update exercise images'
      });
    }
  }

  async getStats(_req: Request, res: Response) {
    try {
      const stats = await databaseExerciseService.getStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error in getStats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get exercise statistics'
      });
    }
  }

  async getHistory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id; // Pega do middleware de autenticação

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
      }

      const history = await databaseExerciseService.getExerciseHistory(id, userId);
      
      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      console.error(`Error in getHistory for ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch exercise history'
      });
    }
  }
}

export default new ExerciseController();