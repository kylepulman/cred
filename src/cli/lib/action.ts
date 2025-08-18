export default function action<Input>(
  args: unknown[],
  newInput: () => Input,
  callback: (input: Input) => void
) {
  let input: Input = newInput()

  Object.keys(input).forEach((key, index) => {
    if (typeof args[index] === 'object') {
      for (const key in args[index]) {
        input[key] = args[index][key]
      }
    } else {
      input[key] = args[index]
    }
  })

  return callback(input)
}