import { Router } from '@grammyjs/router'
import { getItemById } from '@/models/Items'
import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

const addItemsRouter = new Router<Context>((ctx) => ctx.session.route)

addItemsRouter.route('refund', async (ctx: Context) => {
  if (ctx.msg?.text === '/cancel') {
    ctx.session.route = ''
    return ctx.reply(ctx.t('Cancelled'), sendOptions(ctx))
  }

  const itemId = ctx.session.itemId
  const userId = ctx.from?.id

  if (!userId) {
    ctx.session.route = ''
    return ctx.reply(ctx.t('invalidUser'), sendOptions(ctx))
  }

  if (!itemId) {
    ctx.session.route = ''
    return ctx.reply(ctx.t('InvalidItem'), sendOptions(ctx))
  }

  const item = await getItemById(itemId)

  if (!item) {
    ctx.session.route = ''
    return ctx.reply(ctx.t('InvalidItem'), sendOptions(ctx))
  }

  const itemTime =
    item.status.purchasedOn instanceof Date
      ? item.status.purchasedOn.toISOString()
      : false

  if (!itemTime) {
    ctx.session.route = ''
    return ctx.reply(ctx.t('InvalidItem'), sendOptions(ctx))
  }

  if (item.status.refunded === true) {
    ctx.session.route = ''
    return ctx.reply(ctx.t('ItemAlreadyRefunded'), sendOptions(ctx))
  }

  //if itemTime is less than 3 min ago, don't allow refund
  const timeDiff = new Date().getTime() - new Date(itemTime).getTime()
  const timeDiffInMin = timeDiff / 1000 / 60
  if (timeDiffInMin < 3) {
    ctx.session.route = ''
    return ctx.reply(ctx.t('RefundNotAllowed'), sendOptions(ctx))
  }

  const photo = ctx.msg?.photo?.[0]?.file_id

  if (!photo) {
    ctx.session.route = ''
    return ctx.reply(ctx.t('NoPhoto'), sendOptions(ctx))
  }
})
