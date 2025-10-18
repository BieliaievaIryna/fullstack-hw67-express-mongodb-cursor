export const attachTheme = (req, res, next) => {
  res.locals.theme = req.cookies.theme || 'light';
  next();
};
