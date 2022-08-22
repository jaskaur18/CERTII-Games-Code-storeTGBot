import { InlineKeyboard } from 'grammy'
import {
  getCardNumberUsage,
  getItemById,
  setStatusToSold,
} from '@/models/Items'
import { reduceBalance } from '@/models/User'
import Context from '@/models/Context'

export default async function handlepurchaseItem(ctx: Context) {
  const callbackData = ctx.callbackQuery?.data?.split(';')
  const id = callbackData?.[1]

  if (!id)
    return ctx.answerCallbackQuery({
      text: ctx.t('invalidItemId'),
      show_alert: true,
    })

  const item = await getItemById(id)

  if (!item || item.status.sold)
    return ctx.answerCallbackQuery({
      text: ctx.t('itemSolded'),
      show_alert: true,
    })

  if (item.price > ctx.dbuser.balance) {
    return ctx.answerCallbackQuery({
      text: ctx.t('notEnoughBalance'),
      show_alert: true,
    })
  }

  //set sold
  await setStatusToSold(id, ctx.from?.id || 0)

  await reduceBalance(ctx.from?.id || 0, item.price)

  const refundInlineKeyboard = new InlineKeyboard()
  refundInlineKeyboard.text(ctx.t('refund'), `refund;${id}`)

  return ctx.editMessageText(
    `${item.text}\n\n` + `Click On Below Button To Request Refund Within 3 Min`,
    {
      parse_mode: 'HTML',
      reply_markup: refundInlineKeyboard,
    }
  )
}
