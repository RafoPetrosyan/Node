import db from "../services/db.js";
import {hashPassword} from "../helpers/index.js";

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
        values(?, ?, ?, ?, ?)`, [firstName, lastName, email, hashPassword(password), countryId]);

    return Users.get(insertId);
  }

  static update = async (id, params={}) => {
    const { firstName, lastName, email, countryId } = params;

    const res = await db.execute(`UPDATE users SET firstName = ?, lastName = ?, email = ?, countryId = ? WHERE id = ?`,
        [firstName, lastName, email, countryId, id]);

    console.log(res);
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
        [email, hashPassword(password)]);

    if(results[0]){
      delete results[0].password;
    }

    return results[0]
  }

  static list = async (page, limit = 20, countryId = null) => {
    limit = +limit || 20;
    const offset = (page - 1) * limit;
    const values = [];
    let joinType = 'left';

    if(countryId) {
      joinType = 'inner';
      values.push(countryId)
    }

    let query = `select u.*, ct.city as city, ct.id as cityId, ct.country_id as countryId, c.country as country from users u
        left join cities ct on u.cityId = ct.id
        ${joinType} join countries c on ct.country_id = c.id `;

    if(countryId) {
      query += 'AND ct.country_id = ? ';
    }

    query += `LIMIT ${limit} OFFSET ${offset}`;
    const [results] = await db.execute(query, values);

    return results
  }
}

export default Users;
