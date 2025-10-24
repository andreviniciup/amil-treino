import { Router } from 'express';
import progressController from '../controllers/progressController';

const router = Router();

/**
 * Rotas de Progresso
 * Base: /api/progress
 */

// Análises
router.get('/consistency', progressController.getConsistency.bind(progressController));
router.get('/performance', progressController.getPerformance.bind(progressController));
router.get('/goals', progressController.getGoals.bind(progressController));

// Histórico
router.get('/history/:exerciseId', progressController.getHistory.bind(progressController));
router.get('/prs/:exerciseId', progressController.getPersonalRecords.bind(progressController));

// Salvar performance
router.post('/save', progressController.savePerformance.bind(progressController));

export default router;


