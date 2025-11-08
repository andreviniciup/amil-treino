import { Router } from 'express';
import workoutController from '../controllers/workoutController';
import logController from '../controllers/logController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All workout routes require authentication
router.use(authenticate);

// Workout Plans
router.post('/plans', workoutController.createPlan.bind(workoutController));
router.get('/plans', workoutController.getUserPlans.bind(workoutController));
router.get('/plans/:id', workoutController.getPlanById.bind(workoutController));
router.put('/plans/:id', workoutController.updatePlan.bind(workoutController));
router.delete('/plans/:id', workoutController.deletePlan.bind(workoutController));

// Workout Logs
router.post('/logs', logController.createWorkoutLog.bind(logController));
router.get('/logs', logController.getUserLogs.bind(logController));
router.get('/logs/:id', logController.getLogById.bind(logController));

// Check completion status
router.get('/logs/check-workout/:workoutId', logController.checkWorkoutCompletedToday.bind(logController));
router.get('/logs/check-exercise/:workoutId/:exerciseId', logController.checkExerciseCompletedToday.bind(logController));
router.get('/logs/workout-status/:workoutId', logController.getWorkoutExercisesStatus.bind(logController));

// Stats
router.get('/stats', logController.getStats.bind(logController));

export default router;



