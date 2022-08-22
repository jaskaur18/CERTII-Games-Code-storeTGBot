import { getItemById } from '@/models/Items'
import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export default async function handleRefund(ctx: Context) {
  const callbackData = ctx.callbackQuery?.data?.split(';')

  const itemId = callbackData?.[1]

  const userId = ctx.from?.id

  if (!userId)
    return ctx.answerCallbackQuery({
      text: ctx.t('invalidUser'),
      show_alert: true,
    })

  if (!itemId)
    return ctx.answerCallbackQuery({
      text: ctx.t('InvalidItem'),
      show_alert: true,
    })

  const item = await getItemById(itemId)

  if (!item)
    return ctx.answerCallbackQuery({
      text: ctx.t('InvalidItem'),
      show_alert: true,
    })

  const itemTime =
    item.status.purchasedOn instanceof Date
      ? item.status.purchasedOn.toISOString()
      : false

  if (!itemTime)
    return ctx.answerCallbackQuery({
      text: ctx.t('InvalidItem'),
      show_alert: true,
    })

  if (item.status.refunded === true) {
    return ctx.answerCallbackQuery({
      text: ctx.t('ItemAlreadyRefunded'),
      show_alert: true,
    })
  }

  //if itemTime is less than 3 min ago, don't allow refund
  const timeDiff = new Date().getTime() - new Date(itemTime).getTime()
  const timeDiffInMin = timeDiff / 1000 / 60
  if (timeDiffInMin > 3) {
    return ctx.answerCallbackQuery({
      text: ctx.t('RefundNotAllowed'),
      show_alert: true,
    })
  }

  ctx.session.itemId = itemId

  ctx.session.route = 'askrefund'

  await ctx.answerCallbackQuery({
    text: 'Send ScreenShot To Verify',
  })

  return ctx.reply(
    `Send ScreenShot That Proof Item Not Working To Verify`,
    sendOptions(ctx)
  )
}
