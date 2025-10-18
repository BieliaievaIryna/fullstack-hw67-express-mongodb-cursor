export function checkArticleAccess(req, res, next) {
  if (!req.user) {
    return res.status(401).render('index', {
      page: 'protected/accessDenied',
      locals: {
        title: 'Unauthorized',
        message: 'You must be logged in to access this article.',
      },
      theme: req.cookies.theme || 'light',
    })
  }
  next()
}