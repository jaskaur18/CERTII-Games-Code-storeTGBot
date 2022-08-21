import Coinbase from '@/helpers/Coinbase'
import Context from '@/models/Context'
import env from '@/helpers/env'
import sendOptions from '@/helpers/sendOptions'

export default function handleHelp(ctx: Context) {
  return ctx.reply('help', sendOptions(ctx))
}
