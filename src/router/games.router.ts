import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

import gameController from '../controllers/game.controller';
import GameMechanicsController from '../controllers/gameMechanics.controllers';

const gameMechanicsController = new GameMechanicsController();

router.post('/', authMiddleware, gameController.create);
router.get('/', authMiddleware, gameController.getAll);
router.get('/:gameId', authMiddleware, gameController.getGameById);
router.put('/:gameId/join', authMiddleware, gameController.join);
router.delete('/:gameId/', authMiddleware, gameController.delete);

router.put(
  '/game/description',
  authMiddleware,
  gameMechanicsController.validateDescription,
); //body gameId: str, description: string - react on typing

/**
 * CHAT
 */
export const mountGameRouter = () => {
  (router as any).ws('/:id/chat', gameController.chat);
};

export default router;
