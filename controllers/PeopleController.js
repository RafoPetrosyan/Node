import HttpError from "http-errors";
import {People} from "../models/index.js";
import jwt from "jsonwebtoken";
const {JWT_SECRET} = process.env;

class PeopleController {
  static passportCheck = async (req, res, next) => {
    try {
      const {passport} = req.body;
      const person = await People.findOne({
        where: {
          passport,
        }
      });

      if(!person){
        throw HttpError(404)
      }

      if(person.voted) {
        throw HttpError(403, 'You already voted!');
      }

      const token = jwt.sign({personId: person.id}, JWT_SECRET, {
        expiresIn: '15m',
      });

      res.json({
        status: 'ok',
        person,
        token,
      });

    } catch (e) {
      next(e)
    }
  }
}

export default PeopleController;
