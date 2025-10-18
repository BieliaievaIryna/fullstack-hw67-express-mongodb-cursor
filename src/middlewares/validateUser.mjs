export function validateUser(req, res, next) {
  const { username, password } = req.body

  if (!username || username.trim() === '') {
    return res.status(400).send('Username is required')
  }

  if (!password || password.trim() === '') {
    return res.status(400).send('Password is required')
  }

  if (password.length < 4) {
    return res.status(400).send('Password must be at least 4 characters long')
  }

  next()
}
