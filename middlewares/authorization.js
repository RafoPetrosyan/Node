import jwt from "jsonwebtoken";
import HttpError from "http-errors";

const EXCLUDE = ['/users/login', '/users/register'];

export default function authorization(req, res, next) {
  try {
    if(EXCLUDE.includes(req.path)) {
      next();
      return;
    }

    const {authorization = ''} = req.headers;
    const data = jwt.verify(authorization.replace('Bearer ', ''), 'dsggeh564trfh');

    if(!data.userId) throw HttpError(403);
    req.userId = data.userId;
    next();

  } catch (e) {
    e.status = 403;
    next(e)
  }
}
