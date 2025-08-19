import { Command } from 'commander'
import { z } from 'zod'
import action from '../lib/action'
import { selectAll, selectById } from '@/models/cred'
import { decrypt } from '@/lib/encryption'
import clipboardy from 'clipboardy'

const Input = z.object({
  id: z.string().optional(),
  copy: z.union([
    z.literal('id'),
    z.literal('name'),
    z.literal('identifier'),
    z.literal('secret'),
    z.literal(true),
    z.undefined()
  ])
})

type Input = z.infer<typeof Input>

function newInput() {
  return {
    id: '',
    copy: undefined
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
  .option('--copy [field]')
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

        if (input.copy) {
          if (input.copy === true) {
            await clipboardy.write(output.secret)
            console.log('secret copied!')
          } else {
            await clipboardy.write(output[input.copy])
            console.log(`${input.copy} copied!`)
          }
        }

        console.log(output)
      } else {
        const output = SelectAllOutput.parse(selectAll())

        console.log(output)
      }
    }
  ))