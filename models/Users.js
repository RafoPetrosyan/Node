import md5 from "md5";
import db from "../services/db.js";
const {PASSWORD_SECRET} = process.env;

class Users {
  static get = async (id) => {
    const [results] = await db.execute(`SELECT * FROM USERS where id = ?`, [id]);
    if(results[0]){
      delete results[0].password;
    }

    return results[0]
  }

  static create = async (params={}) => {
    const { firstName, lastName, email, password, countryId } = params;
    const [{insertId}] = await db.execute(`INSERT INTO users(firstName, lastName, email, password, countryId)
        values(?, ?, ?, ?, ?)`, [firstName, lastName, email, md5(md5(password) + PASSWORD_SECRET), countryId]);

    return Users.get(insertId);
  }

  static update = async (id, params={}) => {
    const { firstName, lastName, email, countryId } = params;

    const res = await db.execute(`UPDATE users SET firstName = ? lastName = ? email = ? countryId = ? WHERE id = ?`,
        [firstName, lastName, email, countryId, id]);

    console.log(res)
  }

  static delete = async (id) => {
    await db.execute(`DELETE FROM users where id = ?`, [id]);
    return true;
  }

  static getByEmail = async (email) => {
    const [results] = await db.execute(`SELECT * FROM USERS where email = ? limit 1`, [email]);

    if(results[0]){
      delete results[0].password;
    }

    return results[0]
  }

  static auth = async (email, password = '') => {
    const [results] = await db.execute(`SELECT * FROM USERS where email = ? AND password = ? limit 1`,
        [email, md5(md5(password) + PASSWORD_SECRET)]);

    if(results[0]){
      delete results[0].password;
    }

    return results[0]
  }

  static list = async (page, limit = 20, countryId = null) => {
    limit = +limit || 20;
    const offset = (page - 1) * limit;
    const values = [];
    let query = 'SELECT * FROM USERS WHERE 1 = 1 ';
    if(countryId) {
      query += 'AND countryId = ? ';
      values.push(countryId)
    }
    query += `LIMIT ${limit} OFFSET ${offset}`;
    const [results] = await db.execute(query, values);

    return results
  }
}

export default Users;
