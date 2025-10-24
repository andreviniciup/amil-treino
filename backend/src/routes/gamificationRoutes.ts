import { Router } from 'express';
import gamificationController from '../controllers/gamificationController';

const router = Router();

router.get('/score', gamificationController.getScore.bind(gamificationController));
router.get('/badges', gamificationController.getBadges.bind(gamificationController));
router.post('/check-badges', gamificationController.checkBadges.bind(gamificationController));

export default router;


