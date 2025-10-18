const getRootHandler = (req, res) => {
  const theme = req.cookies?.theme || 'light';
  res.render('index', {
    title: 'Home',
    page: 'root/home',
    locals: {},
    theme 
  });
};

export { getRootHandler };
