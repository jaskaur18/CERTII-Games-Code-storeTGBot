import { InlineKeyboard } from 'grammy'
import { addPurchases, reduceBalance } from '@/models/User'
import { getItemById, setStatusToSold } from '@/models/Items'
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

  await addPurchases(ctx.from?.id || 0, {
    id,
    itemName: item.name,
    itemPrice: item.price,
    refund: false,
  })

  const refundInlineKeyboard = new InlineKeyboard()
  refundInlineKeyboard.text(ctx.t('refund'), `refund;${id}`)

  return ctx.editMessageText(
    `${item.text}\n\n` +
      `You have only 2 chances for submitting a refund approval, if no refund request will be submitted within this amount of time, you'll not be eligible for a refund on that product anymore.`,
    {
      parse_mode: 'HTML',
      reply_markup: refundInlineKeyboard,
    }
  )
}
