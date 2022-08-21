import Context from '@/models/Context'
import env from '@/helpers/env'
import sendOptions from '@/helpers/sendOptions'

export default function handleaddItems(ctx: Context) {
  const isAdmin = env.ADMIN_IDS.includes(`${ctx.from?.id}`)
  if (!isAdmin) return ctx.reply(ctx.t('notAdmin'), sendOptions(ctx))
  ctx.session.route = 'addItemsId'
  return ctx.reply(ctx.t('ItemsId'), sendOptions(ctx))
}
