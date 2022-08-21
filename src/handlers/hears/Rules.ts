import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export default function handleRules(ctx: Context) {
  return ctx.reply(ctx.t('RulesMsg'), sendOptions(ctx))
}
