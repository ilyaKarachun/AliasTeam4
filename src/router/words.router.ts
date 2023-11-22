import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

import wordController from '../controllers/word.controller';

router.post('/', authMiddleware, wordController.addWord);
router.get('/randomWord', authMiddleware, wordController.getRandomWord);
router.put('/:wordId', authMiddleware, wordController.updateWord);
router.delete('/:wordId', authMiddleware, wordController.deleteWord);

export default router;
