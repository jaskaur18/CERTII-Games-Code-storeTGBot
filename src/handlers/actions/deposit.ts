import { InlineKeyboard } from 'grammy'
import { Menu } from '@grammyjs/menu'
import { addBalance, regenrateWalletAddress } from '@/models/User'
import { checkBTCPayment, getBtcRate } from '@/helpers/Wallet'
import Context from '@/models/Context'

// const confirmDeposit = async (ctx: Context) => {

// }

export const confirmDepositKeyboard = new Menu<Context>(
  'confirmDepositMenu'
).text('Confirm Deposit', async (ctx: Context) => {
  const deposit = await checkBTCPayment(ctx.dbuser.walletAddress)
  console.log(deposit)

  if (!deposit) {
    return ctx.reply('No deposit found')
  }
  if (deposit === 0) {
    return ctx.reply('No deposit found')
  }
  if (isNaN(deposit)) {
    return ctx.reply('Invalid amount')
  }

  await addBalance(ctx.from?.id || 0, deposit)
  await regenrateWalletAddress(ctx.from?.id || 0)
  return ctx.reply(`Deposit of ${deposit} BTC received`)
})

export default async function handleDeposit(ctx: Context) {
  const callbackData = ctx.callbackQuery?.data?.split(';')

  const param = callbackData?.[1]

  if (!param) {
    return ctx.answerCallbackQuery({
      text: 'Invalid deposit amount',
    })
  }

  if (param === 'custom') {
    ctx.session.route = 'customDeposit'
    return ctx.editMessageText('Enter amount To Deposit', {
      reply_markup: undefined,
    })
  }

  const amount = parseInt(param)

  if (isNaN(amount)) {
    return ctx.answerCallbackQuery({
      text: 'Invalid deposit amount',
    })
  }

  const amountInBtc = await getBtcRate(amount)

  if (!amountInBtc)
    return ctx.answerCallbackQuery({
      text: 'Invalid deposit amount',
    })

  const message =
    `You are about to deposit $${amount} to your wallet.\n\n` +
    `Amount in BTC To Deposit: <code>${amountInBtc}</code>\n\n` +
    `Wallet Address: <code>${ctx.dbuser.walletAddress}</code>\n\n` +
    `After you deposit, click <b>Confirm</b> to continue.`

  return ctx.editMessageText(message, {
    reply_markup: confirmDepositKeyboard,
    parse_mode: 'HTML',
  })
}
