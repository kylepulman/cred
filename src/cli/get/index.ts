import { Command } from 'commander'
import { z } from 'zod'
import action from '../lib/action'
import { selectAll, selectById } from '@/models/cred'
import { decrypt } from '@/lib/encryption'

const Input = z.object({
  id: z.string().optional()
})

type Input = z.infer<typeof Input>

function newInput() {
  return {
    id: ''
  } satisfies Input
}

const SelectByIdOutput = z.object({
  id: z.uuidv4(),
  name: z.string(),
  identifier: z.string(),
  secret: z.string()
})

type SelectByIdOutput = z.infer<typeof SelectByIdOutput>

const SelectByIdResult = z.object({
  id: z.uuidv4(),
  name: z.string(),
  identifier: z.string(),
  secret: z.instanceof(Buffer)
})

type SelectByIdResult = z.infer<typeof SelectByIdResult>

const SelectAllOutput = z.object({
  id: z.uuidv4(),
  name: z.string()
}).array()

type SelectAllOutput = z.infer<typeof SelectAllOutput>

export default new Command()
  .name('get')
  .description('Get credential by ID or list credentials.')
  .arguments("[id]")
  .action((...args) => action<Input>(
    args,
    newInput,
    async (input) => {
      input = Input.parse(input)

      if (input.id) {
        const result = SelectByIdResult.parse(selectById({
          id: input.id
        }))

        const output: SelectByIdOutput = {
          ...result,
          secret: (await decrypt(process.env.CRED_PASS, result.secret)).toString()
        }

        console.log(output)
      } else {
        const output = SelectAllOutput.parse(selectAll())

        console.log(output)
      }
    }
  ))