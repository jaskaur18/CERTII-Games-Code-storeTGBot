import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export default function handleProfile(ctx: Context) {
  const balance = ctx.dbuser.balance
  const totalPurchases = ctx.dbuser.purchases.length
  const totalRefund = ctx.dbuser.purchases.filter((p) => p.refund).length
  const totalSpent = ctx.dbuser.purchases
    .map((p) => p.itemPrice)
    .reduce((a, b) => a + b, 0)

  return ctx.reply(
    ctx.t('profileMsg', {
      firstName: `${ctx.from?.first_name}`,
      id: `${ctx.from?.id}`,
      balance: `${balance}`,
      totalPurchases,
      totalSpent,
      totalRefund,
    }),
    sendOptions(ctx)
  )
}
