import { Command } from 'commander'
import { z } from 'zod'
import action from '../lib/action'
import { deleteById } from '@/models/cred'

const Input = z.object({
  id: z.string()
})

type Input = z.infer<typeof Input>

function newInput() {
  return {
    id: ''
  } satisfies Input
}

const Output = z.object({
  changes: z.number()
})

type Output = z.infer<typeof Output>

export default new Command()
  .name("del")
  .description("Delete credential by ID.")
  .arguments("<id>")
  .action((...args) => action<Input>(
    args,
    newInput,
    async (input) => {
      input = Input.parse(input)

      const output = Output.parse(deleteById({
        id: input.id
      }))

      console.log(`${output.changes} credentials deleted.`)
    }
  ))