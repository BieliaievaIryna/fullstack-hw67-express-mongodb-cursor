import { Router } from 'express';
import { setThemeHandler, getThemeHandler } from '../controllers/themeController.mjs';

const router = Router();

router.get('/', getThemeHandler);
router.post('/', setThemeHandler);

export default router;