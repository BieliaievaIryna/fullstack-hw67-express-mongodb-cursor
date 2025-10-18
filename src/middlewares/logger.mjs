export const logRequests = (req, res, next) => {
  if (!req.url.startsWith('/.well-known')) {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  }
  next();
};