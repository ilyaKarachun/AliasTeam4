import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

import gameController from '../controllers/game.controller';

router.post('/', authMiddleware, gameController.create);
router.get('/', authMiddleware, gameController.getAll);
router.get('/:gameId', authMiddleware, gameController.getGameById);
// router.get('/:gameId/chat', authMiddleware, gameController.joinTeamChat);
// router.get('/:gameId/winner', authMiddleware, gameController.getWinner);
router.put('/:gameId/join', authMiddleware, gameController.join);
// router.delete('/:gameId', authMiddleware, gameController.deleteGame);

export default router;
