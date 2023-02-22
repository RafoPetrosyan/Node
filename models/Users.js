import _ from "lodash";
import fs from "fs";
import md5 from "md5";
import path from "path";

class Users {

  static create = (data = {}) => {
    console.log('data,', data)
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
    console.log(usersList, country)
    if (country) {
      usersList = usersList.filter((user) => user.countryId === country);
    }
    console.log('<<<<<country>>>>>', usersList);

    return  _.chunk(usersList, limit)[page - 1] || [];

  }

}

export default Users;
