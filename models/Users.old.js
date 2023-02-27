import _ from "lodash";
import fs from "fs";
import md5 from "md5";
import path from "path";

class Users {

  static create = (data = {}) => {
    const { firstName, lastName, email, password, countryId } = data;

    const usersFile = path.join('./data/users', email + '.json');

    fs.writeFileSync(usersFile, JSON.stringify({
      firstName, lastName, email, password: md5(md5(password) + '324ertfcghv'), countryId
    }, null, 2))
  }

  static get = (email) => {
    const usersFile = path.join('./data/users', email + '.json');
    try {
      return JSON.parse(fs.readFileSync(usersFile, 'utf8'))
    } catch (e) {
      return null
    }
  }

  static list = (page = 1, limit = 20, country) => {
    const usersDir = path.resolve('./data/users');

    let usersList = fs.readdirSync(usersDir).map(file => {
      try {
        return JSON.parse(fs.readFileSync(path.join(usersDir, file), 'utf8'));
      } catch (e) {
        return null
      }
    }).filter(d => d)
    if (country) {
      usersList = usersList.filter((user) => user.countryId === country);
    }

    return  _.chunk(usersList, limit)[page - 1] || [];

  }

  static update = (data = {}) => {
    const { userEmail, firstName, lastName, email, countryId } = data;
    const usersFile = path.join('./data/users', userEmail + '.json');
    try {
      const user = JSON.parse(fs.readFileSync(usersFile, 'utf8'));

      fs.writeFileSync(usersFile, JSON.stringify(
        _.extend(user, {firstName, lastName, email, countryId})
      , null, 2));

      fs.renameSync(user, path.join('./data/users', email + '.json'));

      delete data.userEmail;
      return _.extend(user, data);
    } catch (e) {
      return null
    }
  }

}

export default Users;
