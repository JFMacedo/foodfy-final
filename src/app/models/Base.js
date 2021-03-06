const db = require('../../config/db')

const Base = {
  init({ table }) {
    if(!table) throw new Error('Invalid Params')
    this.table = table

    return this
  },
  async create(fields) {
    try {
      let keys = [], values = []

      Object.keys(fields).map(key => {
        keys.push(key)

        Array.isArray(fields[key])
        ? values.push(`'{"${fields[key].join('","')}"}'`)
        : values.push(`'${fields[key]}'`)
      })

      const results = await db.query(`
        INSERT INTO ${this.table} (
          ${keys.join(',')}
        ) VALUES (
          ${values.join(',')}
        ) RETURNING id
      `)

      return results.rows[0].id
    } catch (error) {
      console.error(error)
    }
  },
  update(id, fields) {
    try {
      let update = []

      Object.keys(fields).map(key => {
        let line

        Array.isArray(fields[key])
        ? line = `${key} = '{"${fields[key].join('","')}"}'`
        : line = `${key} = '${fields[key]}'`
        update.push(line)
      })

      return db.query(`
        UPDATE ${this.table} SET
          ${update.join(',')}
        WHERE id = $1
      `, [id])
    } catch (error) {
      console.error(error)
    }
  },
  delete(id) {
    return db.query(`
      DELETE FROM ${this.table} WHERE id = $1
    `, [id])
  }
}

module.exports = Base