import jwt from 'jsonwebtoken';
import {Users, Cities, Countries} from "../models";
import HttpError from "http-errors";
import validate from "../services/validate.js";
const {JWT_SECRET} = process.env;

class UsersController {
  static login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({
        where: {
          email,
          password: Users.hashPassword(password),
        },
      });

      console.log(user, 888)

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

      validate(req.body, {
        firstName: 'required|alpha',
        lastName: 'required|alpha',
        email: 'required|email',
        password: 'required|min:3',
        cityId: 'numeric',
        'images.*': 'numeric',
      });

      if (await Users.findOne({where: {email}})) {
        throw HttpError(422, {
          errors: {
            email: ['Email already exits'],
          }
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
      let { page = 1, cityId, search, limit } = req.query;
      limit = +limit || 20;
      page = +page || 1;

      const where = {};
      if(search) {
        where.$or = [
          {firstName : {$like: `%${search}%`}},
          {lastName : {$like: `%${search}%`}},
          {email : {$like: `%${search}%`}},
        ]
      }

      if(cityId) {
        where.$and = {
          cityId,
        }
      }

      const users = await Users.findAll({
        where,
        // raw: true,
        // nest: true,
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
        limit: limit,
        offset: (page - 1) * limit,
        logging: true,
      });

      const ct = await Cities.count({
        where: {id: 1},
        distinct: true,
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
      const user = await Users.findOne({
        where: {
          id: userId
        },
        include: [
          {
            model: Cities,
            required: false,
            as: 'city',
            include: [{
              model: Countries,
              required: false,
              as: 'country',
            }],
          },
        ],
      });
      if (!user) {
        throw HttpError(404);
      }
      // user.location = await Countries.get(user.cityId);

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
