import { decrypt, encrypt } from "@/lib/encryption"
import { insertAndReturnPassword, selectPassword } from "@/models/cred"
import type { Command } from "commander"

export async function preAction(_thisCommand: Command, actionCommand: Command) {
  const inputPassword = process.env.CRED_PASS

  if (!inputPassword) {
    actionCommand.error('Password not found.')
  }

  let storedPasswordEncrypted = selectPassword()

  if (!storedPasswordEncrypted) {
    storedPasswordEncrypted = insertAndReturnPassword(await encrypt(inputPassword, inputPassword))
    console.log("Password stored.")
  }

  try {
    const storedPassword = (await decrypt(inputPassword, storedPasswordEncrypted)).toString()

    if (inputPassword !== storedPassword) {
      actionCommand.error('Password mismatch.')
    }
  } catch (error) {
    if ('code' in error && error.code === 'ERR_OSSL_BAD_DECRYPT') {
      actionCommand.error('Password mismatch.')
    }

    actionCommand.error('Unhandled error at preAction:', error)
  }
}