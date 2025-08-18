import Database from 'better-sqlite3'

const name = 'database.db'

const sql = `
CREATE TABLE IF NOT EXISTS cred (
  id TEXT,
  name TEXT,
  identifier TEXT,
  secret BLOB
)`

export default new Database(name).exec(sql)