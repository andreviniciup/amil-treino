import { Router } from 'express';
import exerciseController from '../controllers/exerciseController';
import autoCacheService from '../services/autoCacheService';
import cacheService from '../services/cacheService';
import databaseExpansionService from '../services/databaseExpansionService';
import multiModalExerciseService from '../services/multiModalExerciseService';

const router = Router();

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

// POST /api/exercises/cache/clear - Limpar cache (útil para desenvolvimento)
router.post('/cache/clear', exerciseController.clearCache.bind(exerciseController));

// GET /api/exercises/cache/stats - Estatísticas do cache
router.get('/cache/stats', async (_req, res) => {
  try {
    const cacheStats = cacheService.getStats();
    const autoCacheStats = await autoCacheService.getCacheStats();
    
    res.json({
      success: true,
      data: {
        cache: cacheStats,
        autoCache: autoCacheStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get cache stats'
    });
  }
});

// POST /api/exercises/cache/sync - Forçar sincronização
router.post('/cache/sync', async (_req, res) => {
  try {
    const result = await autoCacheService.forceSync();
    res.json({
      success: result.success,
      message: result.message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to sync cache'
    });
  }
});

// POST /api/exercises/images/update - Atualizar imagens dos exercícios
router.post('/images/update', exerciseController.updateImages.bind(exerciseController));

// POST /api/exercises/expand - Expandir base de dados
router.post('/expand', async (_req, res) => {
  try {
    const result = await databaseExpansionService.expandDatabase();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to expand database',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/exercises/database/stats - Estatísticas detalhadas da base de dados
router.get('/database/stats', async (_req, res) => {
  try {
    const stats = await databaseExpansionService.getDatabaseStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get database stats'
    });
  }
});

// POST /api/exercises/clean - Limpar duplicatas
router.post('/clean', async (_req, res) => {
  try {
    const result = await databaseExpansionService.cleanDuplicates();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clean duplicates',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/exercises/categories - Obter todas as categorias de modalidades
router.get('/categories', (_req, res) => {
  try {
    const categories = multiModalExerciseService.getCategories();
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get categories'
    });
  }
});

// GET /api/exercises/modal/:category - Buscar exercícios por modalidade
router.get('/modal/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const exercises = await multiModalExerciseService.getExercisesByCategory(category);
    
    res.json({
      success: true,
      data: exercises,
      count: exercises.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get exercises by category'
    });
  }
});

// GET /api/exercises/tags/:tags - Buscar exercícios por tags
router.get('/tags/:tags', async (req, res) => {
  try {
    const { tags } = req.params;
    const tagArray = tags.split(',').map(tag => tag.trim());
    const exercises = await multiModalExerciseService.getExercisesByTags(tagArray);
    
    res.json({
      success: true,
      data: exercises,
      count: exercises.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get exercises by tags'
    });
  }
});

// GET /api/exercises/difficulty/:level - Buscar exercícios por dificuldade
router.get('/difficulty/:level', async (req, res) => {
  try {
    const { level } = req.params;
    const exercises = await multiModalExerciseService.getExercisesByDifficulty(level);
    
    res.json({
      success: true,
      data: exercises,
      count: exercises.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get exercises by difficulty'
    });
  }
});

// GET /api/exercises/:id - Exercício específico (por último)
router.get('/:id', exerciseController.getById.bind(exerciseController));

export default router;



