import { Router } from '@grammyjs/router'
import { addBalance, setRefundPurchases } from '@/models/User'
import { confirmDepositKeyboard } from '@/handlers/actions/deposit'
import { getBtcRate } from '@/helpers/Wallet'
import { getItemById, setRefund } from '@/models/Items'
import AdminIds from '@/helpers/constant'
import Context from '@/models/Context'
import bot from '@/helpers/bot'
import checkValidScreenshot from '@/helpers/imageOcr'
import env from '@/helpers/env'
import sendOptions from '@/helpers/sendOptions'

const refundRouter = new Router<Context>((ctx) => ctx.session.route)

refundRouter.route('askrefund', async (ctx: Context) => {
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
  if (timeDiffInMin > 3) {
    ctx.session.route = ''
    return ctx.reply(ctx.t('RefundNotAllowed'), sendOptions(ctx))
  }

  if (ctx.session.refundAttempts === 3) {
    ctx.session.route = ''
    return ctx.reply(
      `Your Have Already Attempted 3 Times Now You Can't Get Refund`,
      sendOptions(ctx)
    )
  }

  ctx.session.refundAttempts = ctx.session.refundAttempts + 1

  const photo = ctx.msg?.photo?.[ctx.msg?.photo?.length - 1]?.file_id

  if (!photo) {
    // ctx.session.route = ''
    return ctx.reply(ctx.t('NoPhoto'), sendOptions(ctx))
  }

  const imageUrl = (await ctx.api.getFile(photo)).file_path
  if (!imageUrl) return false

  AdminIds.map((adminId) => {
    return bot.api.sendPhoto(adminId, photo, {
      caption:
        `User - <a href="tg://user?id=${ctx.from?.id}">${ctx.from?.first_name} ${ctx.from?.last_name}</a> (@${ctx.from?.username})}\n\n` +
        `Requeted For Refun Of Item - <code>${itemId}</code>\n` +
        `Item Price - ${item.price}`,
      parse_mode: 'HTML',
    })
  })

  ctx.session.route = ''

  return ctx.reply(
    `Refund Request Has Been Forwarded To Admin For Manual Verifcation`,
    sendOptions(ctx)
  )

  // const validScreenshot = await checkValidScreenshot(
  //   Number(item.name.split(' ')[0]),
  //   `https://api.telegram.org/file/bot${env.TOKEN}/${imageUrl}`
  // )
  // // const validScreenshot = true

  // if (!validScreenshot) {
  //   return ctx.reply(
  //     `Cannot Verify Please Send Valid And Clear ScreenShot`,
  //     sendOptions(ctx)
  //   )
  // }

  // ctx.session.refundAttempts = 0

  // await setRefund(itemId)
  // await addBalance(userId, item.price)

  // await setRefundPurchases(ctx.from.id || 0, itemId)

  // ctx.session.route = ''

  // return ctx.reply(
  //   `We Have Verified And Refunded The Money In Your Wallet`,
  //   sendOptions(ctx)
  // )
})

refundRouter.route('customDeposit', async (ctx: Context) => {
  if (!ctx.msg?.text) {
    return ctx.reply(ctx.t('InvalidAmount'), sendOptions(ctx))
  }
  if (ctx.msg?.text === '/cancel') {
    ctx.session.route = ''
    return ctx.reply(ctx.t('Cancelled'), sendOptions(ctx))
  }

  const amount = parseInt(ctx.msg?.text)

  if (isNaN(amount)) {
    return ctx.reply(ctx.t('InvalidAmount'), sendOptions(ctx))
  }

  const amountInBtc = await getBtcRate(amount)

  if (!amountInBtc) return ctx.reply(ctx.t('InvalidAmount'), sendOptions(ctx))

  ctx.session.route = ''

  const message =
    `You are about to deposit $${amount} to your wallet.\n\n` +
    `Amount in BTC To Deposit: <code>${amountInBtc}</code>\n\n` +
    `Wallet Address: <code>${ctx.dbuser.walletAddress}</code>\n\n` +
    `After you deposit, click <b>Confirm</b> to continue.`

  return ctx.reply(message, {
    reply_markup: confirmDepositKeyboard,
    parse_mode: 'HTML',
  })
})

export default refundRouter
