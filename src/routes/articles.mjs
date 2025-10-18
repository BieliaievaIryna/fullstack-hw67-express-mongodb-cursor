import { Router } from 'express';
import {
  getArticlesHandler,
  postArticlesHandler,
  getArticleByIdHandler,
  putArticleByIdHandler,
  replaceArticleByIdHandler,
  deleteArticleByIdHandler,
  getArticlesCursorHandler,
  getArticlesStatsHandler
} from '../controllers/articlesController.mjs';
import { checkArticleAccess } from '../middlewares/articleAccess.mjs';
import { validateArticle } from '../middlewares/validateArticle.mjs';

const router = Router();

router.get('/', getArticlesHandler);
router.post('/', validateArticle, postArticlesHandler);
router.get('/:articleId', checkArticleAccess, getArticleByIdHandler);
router.put('/:articleId', checkArticleAccess, validateArticle, putArticleByIdHandler);
router.patch('/:articleId', checkArticleAccess, validateArticle, replaceArticleByIdHandler);
router.delete('/:articleId', checkArticleAccess, deleteArticleByIdHandler);
router.get('/cursor/list', getArticlesCursorHandler);
router.get('/stats/summary', getArticlesStatsHandler);

export default router;
