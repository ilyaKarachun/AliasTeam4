import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

import gameController from '../controllers/game.controller';

router.post('/', authMiddleware, gameController.createGame);

export default router;
