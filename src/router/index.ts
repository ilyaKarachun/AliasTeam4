import { Router } from 'express';
const router = Router();

import usersRouter from './users.router';
import documentRouter from './document.router';

router.use('/users', usersRouter);
router.use('/document', documentRouter);

export default router;
