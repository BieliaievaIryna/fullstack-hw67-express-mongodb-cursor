import { Router } from 'express';
import { celebrate, Segments } from 'celebrate'
import Joi from 'joi'
import {
  getLoginPage,
  getRegisterPage,
  registerHandler,
  loginHandler,
  logoutHandler,
  profileHandler,
} from '../controllers/authController.mjs';
import { ensureAuthenticated } from '../middlewares/passportAuth.mjs';

const router = Router();

router.get('/login', getLoginPage);
router.post(
  '/login',
  celebrate({
    [Segments.BODY]: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  loginHandler
)
router.get('/register', getRegisterPage);
router.post(
  '/register',
  celebrate({
    [Segments.BODY]: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().min(5).required(),
      name: Joi.string().optional(), 
      email: Joi.string().email().optional() 
    }),
  }),
  registerHandler
)

router.post('/logout', logoutHandler);
router.get('/profile', ensureAuthenticated, profileHandler);

export default router;
