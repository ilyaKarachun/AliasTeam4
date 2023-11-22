import { Router } from 'express';
const router = Router();

import usersRouter from './users.router';
import documentRouter from './document.router';
import gameRouter from './game.router';

router.use('/users', usersRouter);
router.use('/document', documentRouter);
router.use('/games', gameRouter);

export default router;
