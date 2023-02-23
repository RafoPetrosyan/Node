import md5 from "md5";
import _ from "lodash";
import jwt from 'jsonwebtoken';
import Users from "../models/Users";
import HttpError from "http-errors";

class UsersController {
  static login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = Users.get(email);

      if (!user || !password || user.password !== md5(md5(password) + '324ertfcghv')) {
        throw HttpError(401, 'invalid email or password');
      }

      const token = jwt.sign({ userEmail: user.email }, 'dsggeh564trfh', {
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
      } else if (Users.get(email)) {
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

      Users.create({
        firstName, lastName, email, password, countryId
      })

      res.json({
        status: 'ok',
      })

    } catch (e) {
      next(e)
    }
  }
  static usersList = async (req, res, next) => {
    try {
      const { page, country } = req.query;
      const users = Users.list(+page || 1, 20, country);
      res.json({
        status: 'ok',
        users,
      })
    } catch (e) {
      next(e)
    }
  };

  static profile = async (req, res, next) => {

    const {userEmail} = req;

    try {
      const user = Users.get(userEmail);
      res.json({
        status: 'ok',
        user,
      })
    } catch (e) {
      next(e)
    }
  };

  static filterPostedUsers = async (req, res, next) => {
    try {
      const { country } = req.body
      console.log('<<<<<<<<<req.body======>>>>>>>>>', req.body)
      res.redirect(`/users?country=${country}`)
    } catch (e) {
      next(e)
    }
  }

  static logOut = async (req, res, next) => {
    try {
      req.session.destroy();
      res.redirect(`/`);
    } catch (e) {
      next(e)
    }
  }

}

export default UsersController;
