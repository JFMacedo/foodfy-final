const db = require('../../config/db')
const Base = require('./Base')

Base.init({ table: 'recipes_files' })

module.exports = {
  ...Base,
  async findOne(filters) {
    let query = `SELECT * FROM recipes_files`

    Object.keys(filters).map(key => {
      query += ` ${key}`

      Object.keys(filters[key]).map(field => {
        query += ` ${field} = '${filters[key][field]}'`
      })
    })

    const results = await db.query(query)
    return results.rows[0]
  }
}