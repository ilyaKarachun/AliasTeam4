import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

import wordController from '../controllers/word.controller';

router.get('/randomWord', authMiddleware, wordController.getWord);

export default router;
