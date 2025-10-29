import { Router } from 'express';
import exerciseController from '../controllers/exerciseController';

const router = Router();

// MVP v0.01: Rotas simplificadas - apenas consultas ao banco de dados
// Removido: seed automático, cache, APIs externas, expansão de database

// GET /api/exercises - Buscar todos os exercícios
router.get('/', exerciseController.getAll.bind(exerciseController));

// GET /api/exercises/search?q=supino - Buscar exercícios
router.get('/search', exerciseController.search.bind(exerciseController));

// GET /api/exercises/bodypart/chest - Exercícios por grupo muscular
router.get('/bodypart/:bodyPart', exerciseController.getByBodyPart.bind(exerciseController));

// GET /api/exercises/category/musculacao - Exercícios por categoria do app
router.get('/category/:category', exerciseController.getByCategory.bind(exerciseController));

// GET /api/exercises/stats - Estatísticas do banco interno (ANTES de :id)
router.get('/stats', exerciseController.getStats.bind(exerciseController));

// GET /api/exercises/:id/history - Histórico de um exercício específico
router.get('/:id/history', exerciseController.getHistory.bind(exerciseController));

// GET /api/exercises/:id - Exercício específico (por último)
router.get('/:id', exerciseController.getById.bind(exerciseController));

export default router;



