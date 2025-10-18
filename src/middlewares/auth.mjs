export function basicAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).render('index', {
      page: 'protected/accessDenied',
      locals: {
        title: 'Access Denied',
        message: 'Access denied. Please log in to continue.',
      },
      theme: req.cookies.theme || 'light',
    })
  }
  next()
}