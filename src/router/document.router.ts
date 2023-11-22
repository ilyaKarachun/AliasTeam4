import { Router } from 'express';
const router = Router();

import documentController from '../controllers/document.controller';

router.post('/create', documentController.createDocument);
router.get('/alldata', documentController.getAllDocuments);

export default router;
