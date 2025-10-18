export const getThemeHandler = (req, res) => {
  const theme = req.cookies.theme || 'light';
  res.status(200).json({ theme });
};

export const setThemeHandler = (req, res) => {
  const { theme } = req.body;
  const allowedThemes = ['light', 'dark'];

  if (!theme || !allowedThemes.includes(theme)) {
    return res.status(400).send('Invalid or missing theme');
  }

  res.cookie('theme', theme, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: false,
    sameSite: 'lax', 
  });

  res.redirect(req.headers.referer || '/');
};