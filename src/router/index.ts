import { Router } from 'express';
const router = Router();

import usersRouter from './users.router';
import wordsRouter from './words.router';

router.use('/users', usersRouter);
router.use('/words', wordsRouter);

export default router;
