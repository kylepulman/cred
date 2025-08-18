import { Command } from 'commander'
import { z } from 'zod'
import action from '../lib/action'
import { insertOne } from '@/models/cred'
import { encrypt } from '@/lib/encryption'

const Input = z.object({
  name: z.string(),
  identifier: z.string(),
  secret: z.string(),
  encrypt: z.union([z.string(), z.literal(true)]).optional()
})

type Input = z.infer<typeof Input>

function newInput() {
  return {
    name: '',
    identifier: '',
    secret: '',
  } satisfies Input
}

const Output = z.object({
  id: z.string()
})

type Output = z.infer<typeof Output>

export default new Command()
  .name('add')
  .description('Add new credential.')
  .arguments("<name> <identifier> <secret>")
  .action((...args) => action<Input>(
    args,
    newInput,
    async (input) => {
      input = Input.parse(input)

      const output = Output.parse(insertOne({
        name: input.name,
        identifier: input.identifier,
        secret: await encrypt(process.env.CRED_PASS, input.secret)
      }))

      console.log(`Credential with ID "${output.id}" created!`)
    }
  ))