import { Router } from 'express';
const router = Router();

import userController from '../controllers/user.controller';

router.post('/register', userController.registration);
router.post('/login', userController.login);

export default router;
