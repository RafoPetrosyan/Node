import HttpError from "http-errors";
import {Candidates, People} from "../models/index.js";
import jwt from "jsonwebtoken";
import {Sequelize} from "sequelize";
import Mail from "../services/Mail";
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

  static vote = async (req, res, next) => {
    try {
      const {token, candidateId} = req.body;

      const {personId} = jwt.verify(token, JWT_SECRET);

      const person = await People.findOne({
        where: {
          id: personId,
        }
      });

      if(person.voted) {
        await Mail.send('petrosyanrafo0@gmail.com', 'Hello');
        throw HttpError(403, 'You already voted!');
      }

      person.voted = new Date();
      await person.save();

      await Candidates.update({
          votes: Sequelize.literal('votes + 1')
      }, {
        where: {
          id: candidateId
        }
      })

      res.json({
        status: 'ok',
      });

    } catch (e) {
      next(e)
    }
  }
}

export default PeopleController;
