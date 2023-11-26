import { Router } from 'express';
const router = Router();

import gameController from '../controllers/game.controller';

export const mountGameRouter = () => {
  (router as any).ws('/:id/chat', gameController.chat);
};

export default router;
