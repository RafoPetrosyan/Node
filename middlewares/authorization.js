import jwt from 'jsonwebtoken'
import HttpError from "http-errors";

const { JWT_SECRET } = process.env;

const EXCLUDE = [
  'POST:/users/login',
  'POST:/users/register',
  'GET:/countries',
]

export default function authorization(req, res, next) {
  try {
    if(1 || req.method === 'OPTIONS'){
      next();
      return;
    }

    if (EXCLUDE.includes(req.method + ':' +req.path)) {
      next();
      return;
    }
    const authorization = req.headers.authorization || req.query.token || '';
    const data = jwt.verify(authorization.replace('Bearer ', ''), JWT_SECRET);

    if (!data.userId) {
      throw HttpError(401, 'Unauthorized request');
    }
    req.userId = data.userId;
    next();
  } catch (e) {
    e.status = 401;
    e.message = 'Unauthorized request'
    next(e)
  }
}