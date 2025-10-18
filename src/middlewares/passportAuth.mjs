export const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  if (req.accepts('html')) {
    return res.status(401).render('index', {
      page: 'protected/accessDenied',
      locals: { title: 'Access Denied' },
      theme: req.cookies.theme || 'light',
    });
  }
  return res.status(401).send('Unauthorized');
};
