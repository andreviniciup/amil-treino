import { Router } from 'express';
import recommendationController from '../controllers/recommendationController';

const router = Router();

/**
 * Rotas de Recomendação
 * 
 * Base: /api/recommendations
 */

// Obter recomendações gerais para o usuário
router.get('/', recommendationController.getRecommendations.bind(recommendationController));

// Obter recomendações de métodos de treino
router.get('/methods', recommendationController.getMethodRecommendations.bind(recommendationController));

// Obter todos os métodos disponíveis
router.get('/methods/all', recommendationController.getAllMethods.bind(recommendationController));

// Obter método específico por nome
router.get('/methods/:name', recommendationController.getMethodByName.bind(recommendationController));

// Obter recomendações de exercícios
router.get('/exercises', recommendationController.getExerciseRecommendations.bind(recommendationController));

export default router;


