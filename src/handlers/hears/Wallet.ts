import { InlineKeyboard } from 'grammy'
import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

const depositMoneyPresets = [
  10, 20, 30, 50, 100, 150, 200, 250, 300, 350, 400, 500, 750, 1000,
]

export default function handleWallet(ctx: Context) {
  const depositMoneyKeyboard = new InlineKeyboard()
  depositMoneyPresets
    .map((preset, index) => {
      if (index % 3 === 0) {
        depositMoneyKeyboard.row()
      }
      depositMoneyKeyboard.text(`🔸$${preset}🔸`, `deposit;${preset}`)
    })
    .reverse()
  depositMoneyKeyboard.row()
  depositMoneyKeyboard.text('💰 Custom Money', 'deposit;custom')

  return ctx.reply(
    ctx.t('walletMsg', {
      userId: `${ctx.from?.id}`,
      balance: ctx.dbuser.balance,
    }),
    { ...sendOptions(ctx), reply_markup: depositMoneyKeyboard }
  )
}
