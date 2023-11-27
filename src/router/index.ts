import { Router } from 'express';
const router = Router();
import documentRouter from './document.router';
import usersRouter from './users.router';
import wordsRouter from './words.router';
import gamesRouter from './games.router';

router.use('/users', usersRouter);
router.use('/words', wordsRouter);
router.use('/games', gamesRouter);
router.use('/document', documentRouter);

export default router;
