import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/passportAuth.mjs';

const router = Router();

router.get('/protected', ensureAuthenticated, (req, res) => {
  res.render('index', {
    page: 'protected/protected',
    locals: {
      title: 'Protected Area',
      username: req.user.username,
    },
    theme: req.cookies.theme || 'light',
  });
});

export default router;
