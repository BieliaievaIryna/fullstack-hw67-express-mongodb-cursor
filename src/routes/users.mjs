import { Router } from 'express';
import {
  getUsersHandler,
  postUsersHandler,
  getUserByIdHandler,
  putUserByIdHandler,
  replaceUserByIdHandler,
  deleteUserByIdHandler,
  getUsersCursorHandler,
  getUsersStatsHandler
} from '../controllers/usersController.mjs';
import { basicAuth } from '../middlewares/auth.mjs';
import { validateUser } from '../middlewares/validateUser.mjs';

const router = Router();

router.use(basicAuth);

router.get('/', getUsersHandler);
router.post('/', validateUser, postUsersHandler);
router.get('/:userId', getUserByIdHandler);
router.put('/:userId', validateUser, putUserByIdHandler);
router.patch('/:userId', validateUser, replaceUserByIdHandler);
router.delete('/:userId', deleteUserByIdHandler);
router.get('/cursor/list', getUsersCursorHandler);
router.get('/stats/summary', getUsersStatsHandler);

export default router;
