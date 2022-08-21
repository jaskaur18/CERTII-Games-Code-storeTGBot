import { mainKeyboard } from '@/helpers/constant'
import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export default function handleStart(ctx: Context) {
  return ctx.reply(ctx.t('welcome'), {
    ...sendOptions(ctx),
    reply_markup: mainKeyboard,
  })
}
