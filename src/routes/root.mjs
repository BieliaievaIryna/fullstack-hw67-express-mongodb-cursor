import { Router } from 'express';
import { getRootHandler } from '../controllers/rootController.mjs';

const router = Router();

router.get('/', getRootHandler);

export default router;