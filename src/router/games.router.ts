import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

import gameController from '../controllers/game.controller';

export const mountGameRouter = () => {
  (router as any).ws('/:id/chat', gameController.chat);
};

router.post('/', gameController.createGame);

export default router;
