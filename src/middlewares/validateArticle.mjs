export function validateArticle(req, res, next) {
  const { title } = req.body
  if (!title || title.trim() === '') {
    return res.status(400).send('Bad Request')
  }
  next()
}