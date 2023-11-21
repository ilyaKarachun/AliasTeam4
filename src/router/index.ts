import { Router } from 'express';
const router = Router();

import usersRouter from './users.router';

router.use('/users', usersRouter);

export default router;
