import db from './'

export function insertOne(query: {
  name: string,
  identifier: string,
  secret: Buffer
}) {
  const sql = `
  INSERT INTO cred (
    id,
    name,
    identifier,
    secret
  ) VALUES (
    ?,
    ?,
    ?,
    ?
  ) RETURNING 
    id
  `

  return db
    .prepare(sql)
    .get(
      crypto.randomUUID(),
      query.name,
      query.identifier,
      query.secret
    )
}

export function deleteById(query: {
  id: string
}) {
  const sql = `
  DELETE FROM
    cred
  WHERE
    id = ?
  `

  return db
    .prepare(sql)
    .run(query.id)
}

export function selectById(query: {
  id: string
}) {
  const sql = `
  SELECT
    id,
    name,
    identifier,
    secret
  FROM
    cred
  WHERE
    id = ?
  `

  return db
    .prepare(sql)
    .get(query.id)
}

export function selectAll() {
  const sql = `
  SELECT
    id,
    name
  FROM
    cred
  WHERE
    name != 'password'
  `

  return db
    .prepare(sql)
    .all()
}

export function insertAndReturnPassword(secret: Buffer) {
  const sql = `
  INSERT INTO cred (
    id,
    name,
    identifier,
    secret
  ) VALUES (
   ?,
   ?,
   ?,
   ?
  ) RETURNING
    secret
  `

  return db
    .prepare<[string, 'password', 'password', Buffer], { secret: Buffer }>(sql)
    .get(crypto.randomUUID(), 'password', 'password', secret)
    ?.secret
}

export function selectPassword() {
  const sql = `
  SELECT
    secret
  FROM
    cred
  WHERE
    name = ?
  `

  return db
    .prepare<['password'], { secret: Buffer }>(sql)
    .get('password')
    ?.secret
}