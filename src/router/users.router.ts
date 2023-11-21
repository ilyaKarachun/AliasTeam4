import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

import userController from '../controllers/user.controller';

router.post('/register', userController.registration);
router.post('/login', userController.login);
router.get('/:userId', authMiddleware, userController.getUserById);
router.put('/:userId', authMiddleware, userController.updateStatistics);
router.delete('/:userId', authMiddleware, userController.deleteUser);

export default router;
