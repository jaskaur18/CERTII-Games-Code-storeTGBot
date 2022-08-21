import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export default async function handleAddSubCategory(ctx: Context) {
  await ctx.answerCallbackQuery({
    text: 'Add new sub category',
  })
  ctx.session.route = 'addSubCategoryId'
  return ctx.editMessageText(ctx.t('enterId'), {
    ...sendOptions(ctx),
    reply_markup: undefined,
  })
}
