import md5 from "md5";
import _ from "lodash";
import Users from "../models/Users";
import countriesJson from "../countries.json" assert { type: 'json' };


class UsersController {

  static login = async (req, res, next) => {
    try {
      res.render('users/login', { data: {}, error: '' })
    } catch (e) {
      next(e)
    }
  }
  static loginPost = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = Users.get(email)

      if (!user || !password || user.password !== md5(md5(password) + '324ertfcghv')) {
        const error = 'Invalid email or password';
        res.render('users/login', { data: {}, error })
        return;
      }


      req.session.userEmail = email;
      req.session.save(() => {
        res.redirect(`/users?login=success`)
      });
    } catch (e) {
      next(e)
    }
  }
  static register = async (req, res, next) => {
    try {
      const errors = {};
      const data = {};
      res.render('users/register', { errors, data, countriesJson });
    } catch (e) {
      next(e)
    }
  }
  static registerPost = async (req, res, next) => {
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
      console.log(errors)
      if (!_.isEmpty(errors)) {
        res.render('users/register', { errors: {}, data: req.body, countriesJson });
        return;
      }

      Users.create({
        firstName, lastName, email, password, countryId
      })

      res.redirect(`/users?register=success&country=${countryId}`)
    } catch (e) {
      next(e)
    }
  }
  static usersList = async (req, res, next) => {
    try {


      const { register, page, country } = req.query;
      const users = Users.list(+page || 1, 20, country);
      res.render('users/index', {
        users,
        register,
        countriesJson,
        selectedCountry: country,
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
