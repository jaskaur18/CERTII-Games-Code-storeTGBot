import { InlineKeyboard } from 'grammy'
import { getSubCategories } from '@/models/Categories'
import Context from '@/models/Context'
import env from '@/helpers/env'

export default async function handleCategory(ctx: Context) {
  const IsAdmin = env.ADMIN_IDS.includes(`${ctx.from?.id}`)
  const callbackData = ctx.callbackQuery?.data?.split(';')
  const parentCategoryName = callbackData?.[1] || 'Category'
  const categoryId = callbackData?.[2]

  if (!categoryId)
    return ctx.answerCallbackQuery({
      text: 'Invalid category id',
      show_alert: true,
    })

  const subCategories = await getSubCategories(categoryId)

  const subCategoriesMenu = new InlineKeyboard()

  if (subCategories.length === 0)
    subCategoriesMenu.text(ctx.t('NoSubCategoryAvailable')).row()
  else
    await ctx.answerCallbackQuery({
      text: `${subCategories.length} subcategories found`,
    })

  subCategories.map(({ id, name }) => {
    subCategoriesMenu.text(`🔸 ${name}`, `sub;${id}`).row()
  })

  subCategoriesMenu.text('Search By Bin', 'sub;search').row()

  if (IsAdmin) subCategoriesMenu.text('Add new subcategory', 'addsub').row()
  subCategoriesMenu.text('🌎 Main Menu', 'menu')

  return ctx.editMessageText(
    `${IsAdmin ? 'Category Id - <code>' + categoryId + '</code>' : ''}\n\n` +
      `<code>--- AVAILABLE ${parentCategoryName} DATABASES ---</code>`,
    {
      parse_mode: 'HTML',
      reply_markup: subCategoriesMenu,
    }
  )
}
