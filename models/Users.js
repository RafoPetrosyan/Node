import _ from "lodash";
import fs from "fs";
import md5 from "md5";
import path from "path";
import db from "services/db.js";

class Users {
  static create = (params={}) => {
    const { firstName, lastName, email, password, countryId } = params;

    const res = db.execute(`INSERT INTO users(firstName, lastName, email, password, countryId)
        values(?, ?, ?, ?, ?)`, [firstName, lastName, email, password, countryId]);

    console.log(res)
  }

  static get = (id) => {
    const [results] = db.execute(`SELECT * FROM USERS where id = ?`, [id]);

    return results[0]
  }

  static getByEmail = (email) => {
    const [results] = db.execute(`SELECT * FROM USERS where email = ? limit 1`, [email]);

    return results[0]
  }

  static list = (page, limit, countryId) => {
    const [results] = db.execute(`SELECT * FROM USERS where email = ? limit 1`, [email]);

    return results[0]
  }
}

export default Users;
