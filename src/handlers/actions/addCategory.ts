import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export default async function handleAddCategory(ctx: Context) {
  await ctx.answerCallbackQuery({
    text: 'Add new category',
  })
  await ctx.editMessageText(ctx.t('enterName'), {
    ...sendOptions(ctx),
    reply_markup: undefined,
  })
  ctx.session.route = 'addCategory'
}
