import { Command } from 'commander'

import add from './add'
import del from './del'
import get from './get'
import { preAction } from './hooks'

export default new Command()
  .name('cred')
  .description("Local portable credential manager.")
  .version('0.0.1')
  .hook('preAction', preAction)
  .addCommand(add)
  .addCommand(del)
  .addCommand(get)
  .parse()