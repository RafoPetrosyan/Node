import _ from "lodash";
import jwt from 'jsonwebtoken';
import Users from "../models/Users";
import HttpError from "http-errors";
import Countries from "../models/Countries.js";
const {JWT_SECRET} = process.env;

class UsersController {
  static login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await Users.auth(email, password);

      if (!user) {
        throw HttpError(401, 'invalid email or password');
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: '1h'
      });
      delete user.password;

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
      const { firstName, lastName, email, password, countryId } = req.body;
      const errors = {};
      if (!firstName) {
        errors.firstName = 'First Name is Required';
      }

      if (!email) {
        errors.email = 'Email is Required';
      } else if (await Users.getByEmail(email)) {
        errors.email = 'Email already exists';
      }
      if (!countryId) {
        errors.country = 'this is required';
      }
      if (!_.isEmpty(errors)) {
        throw HttpError(422, {
          errors,
        });
      }

     const user = await Users.create({
        firstName, lastName, email, password, countryId
      })

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
      const { page = 1, cityId, limit = 20 } = req.query;

      const users = await Users.findAll({
        where: {
           firstName : 'LIKE P%'
        },
        limit: +limit,
        offset: +(+page - 1) * +limit,
        logging: true,
      });

      res.json({
        status: 'ok',
        users,
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
      const user = Users.get(userId);

      if (!user) {
        throw HttpError(404, 'User not found');
      }

      const { firstName, lastName, countryId } = req.body;

      await Users.update(userId, { firstName, lastName, countryId });

      res.json({
        status: 'ok'
      });
    } catch (e) {
      next(e);
    }
  };

  static deleteUser = async (req, res, next) => {
    try {
      const {userId} = req;
      const user = await Users.get(userId);

      if(!user) {
        throw HttpError(404, 'User not found');
      }

      await Users.delete(userId);

      res.json({
        status: 'ok'
      })
    } catch (e) {
      next(e)
    }
  };
}

export default UsersController;
