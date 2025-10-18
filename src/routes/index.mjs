import { Router } from 'express';
import rootRouter from './root.mjs';
import usersRouter from './users.mjs';
import articlesRouter from './articles.mjs';
import themeRoutes from './theme.mjs';
import authRoutes from './auth.mjs';
import protectedRoutes from './protected.mjs';

const router = Router();

router.use('/', rootRouter);
router.use('/users', usersRouter);
router.use('/articles', articlesRouter);
router.use('/auth', authRoutes);
router.use('/theme', themeRoutes);
router.use('/', protectedRoutes);

export default router;
