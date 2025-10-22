import { Request, Response } from 'express';
import hybridExerciseService from '../services/hybridExerciseService';

export class ExerciseController {
  async getAll(_req: Request, res: Response) {
    try {
      const exercises = await hybridExerciseService.getAllExercises();

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
      const exercises = await hybridExerciseService.getExercisesByBodyPart(bodyPart);
      
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
      const exercises = await hybridExerciseService.getExercisesByCategory(category);
      
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
      const exercise = await hybridExerciseService.getExerciseById(id);
      
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

      const exercises = await hybridExerciseService.searchExercises(q);
      
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
      await hybridExerciseService.clearInternalCache();
      res.json({
        success: true,
        message: 'Internal exercise cache cleared successfully'
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
      const result = await hybridExerciseService.updateExerciseImages();
      res.json({
        success: true,
        message: 'Exercise images update completed',
        data: result
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
      // Versão simplificada para debug
      res.json({
        success: true,
        data: {
          totalExercises: 0,
          bySource: [],
          byBodyPart: [],
          message: "Stats endpoint working - full implementation pending"
        }
      });
    } catch (error) {
      console.error('Error in getStats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get exercise statistics'
      });
    }
  }
}

export default new ExerciseController();