import { Router } from 'express';
import { ingest } from './controllers/customerController.js';

const router = Router();


router.post('/ingest', ingest);

export default router;