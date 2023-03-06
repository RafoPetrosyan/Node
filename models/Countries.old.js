import db from "../services/db.js";

class Countries {
  static async get(id) {
    const [result] = await db.execute(`select ct.*, c.country as countryName from cities ct
        inner join countries c on ct.id = ? and ct.country_id = c.id`, [id])

    return result[0]
  }

  static async getByIds(ids = []) {
    const q = ids.map(() => '?').join(',')
    const [result] = await db.execute(`SELECT * FROM countries WHERE id in(${q})`, [...ids])

    return result
  }

  static async getAll(search = '') {
    const [result] = await db.execute(`SELECT * FROM countries WHERE country like ? LIMIT 50`, [`%${search}%`])

    return result
  }
}

export default Countries;
