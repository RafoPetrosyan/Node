import _ from "lodash";
import jwt from 'jsonwebtoken';
import {Users, Cities, Countries} from "../models";
import HttpError from "http-errors";
import {hashPassword} from "../helpers/index.js";
const {JWT_SECRET} = process.env;

class UsersController {
  static login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({
        where: {
          email,
          password: hashPassword(password),
        }
      });

      if (!user) {
        throw HttpError(401, 'invalid email or password');
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: '1h'
      });

      res.json({
        status: 'ok',
        token,
        user,
      })

    } catch (e) {
      next(e)
    }
  }

  static register = async (req, res, next) => {
    try {
      const { firstName, lastName, email, password, cityId } = req.body;
      const errors = {};
      if (!firstName) {
        errors.firstName = 'First Name is Required';
      }

      if (!email) {
        errors.email = 'Email is Required';
      } else if (await Users.findOne({where: {email}})) {
        errors.email = 'Email already exists';
      }
      if (!cityId) {
        errors.city = 'this is required';
      }
      if (!_.isEmpty(errors)) {
        throw HttpError(422, {
          errors,
        });
      }

     const user = await Users.create({
        firstName, lastName, email, password, cityId
      })

      // const user = new Users({
      //   firstName, lastName, email, password, cityId
      // })
      //
      // await user.save();
      // //user.id

      res.json({
        status: 'ok',
        user,
      })

    } catch (e) {
      next(e)
    }
  }
  static usersList = async (req, res, next) => {
    try {
      const { page = 1, cityId, search, limit = 20 } = req.query;

      const where = {};
      if(search) {
        where.$or = [
          {firstName : {$like: `%${search}%`}},
          {lastName : {$like: `%${search}%`}},
          {email : {$like: `%${search}%`}},
        ]
      }

      const users = await Users.findAll({
        where,
        include: [
          {
            model: Cities,
            required: true,
            as: 'city',
            include: [{
              model: Countries,
              required: true,
              as: 'country',
            }],
          },
        ],
        // order: [['firstName', 'asc'], ['email', 'desc']],
        limit: +limit,
        offset: +(+page - 1) * +limit,
        logging: true,
      });

      const ct = await Cities.findAll({
        where: {id: 1},
        include: [{
          model: Users,
          required: false,
          as: 'user',
        }],
      })

      res.json({
        status: 'ok',
        users,
        ct,
        // countries,
      })
    } catch (e) {
      next(e)
    }
  };

  static profile = async (req, res, next) => {

    const {userId} = req;

    try {
      const user = await Users.get(userId);
      if (!user) {
        throw HttpError(404);
      }
      user.location = await Countries.get(user.cityId);

      res.json({
        status: 'ok',
        user,
      })
    } catch (e) {
      next(e)
    }
  };

  static updateUser = async (req, res, next) => {
    try {
      const { userId } = req;
      const user = Users.findByPk(userId);

      if (!user) {
        throw HttpError(404, 'User not found');
      }

      const { firstName, lastName, cityId } = req.body;

      await Users.update({
        firstName, lastName, cityId,
      }, {
        where: {
          id: userId,
        }
      });
      const data = await Users.findByPk(userId);

      res.json({
        status: 'ok',
        data,
      });
    } catch (e) {
      next(e);
    }
  };

  static deleteUser = async (req, res, next) => {
    try {
      const {userId} = req;
      const user = await Users.findByPk(userId);

      if(!user) {
        throw HttpError(404, 'User not found');
      }

      await Users.destroy({where: {id: userId}});

      res.json({
        status: 'ok'
      })
    } catch (e) {
      next(e)
    }
  };
}

export default UsersController;
