const EXCLUDE = [
  '/users/login',
  '/users/register'
]

export default function authorization(req, res, next) {
  try {
    if (EXCLUDE.includes(req.path)) {
      next();
      return;
    }
    if (!req.session.userEmail) {
      res.redirect('/users/login');
      return;
    }
    next();
  } catch (e) {
    next(e)
  }
}
