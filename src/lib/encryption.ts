import {
  createCipheriv,
  createDecipheriv,
  randomFill,
  scrypt
} from 'node:crypto'

const ALGORITHM = 'aes-192-cbc'
const KEY_LENGTH = 24
const IV_LENGTH = 16

function generateIv() {
  return new Promise<Uint8Array>((resolve, reject) => {
    randomFill(
      new Uint8Array(IV_LENGTH),
      (err, iv) => err ? reject(err) : resolve(iv)
    )
  })
}

function generateKey(password: string, salt: Uint8Array) {
  return new Promise<Buffer>(async (resolve, reject) => {
    scrypt(
      password,
      salt,
      KEY_LENGTH,
      (err, key) => err ? reject(err) : resolve(key)
    )
  })
}

export async function encrypt(password: string, input: string) {
  const iv = await generateIv()
  const key = await generateKey(password, iv)

  const cipher = createCipheriv(ALGORITHM, key, iv)

  return Buffer.concat([
    iv,
    cipher.update(input, 'utf-8'),
    cipher.final()
  ])
}

export async function decrypt(password: string, input: Buffer) {
  const [iv, encrypted] = [
    Buffer.copyBytesFrom(input, 0, IV_LENGTH),
    Buffer.copyBytesFrom(input, IV_LENGTH)
  ]
  const key = await generateKey(password, iv)

  const decipher = createDecipheriv(ALGORITHM, key, iv)

  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final()
  ])
}