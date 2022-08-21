import { Categories, getCategories } from '@/models/Categories'
import { InlineKeyboard } from 'grammy'
import Context from '@/models/Context'
import env from '@/helpers/env'
import sendOptions from '@/helpers/sendOptions'

export function generateStoreKeyboard(
  categories: Categories[],
  isAdmin = false
) {
  const categoriesKeyboard = new InlineKeyboard()

  categories
    .map((category) => {
      categoriesKeyboard
        .text(`${category.name}`, `cat;${category.name};${category.id}`)
        .row()
    })
    .reverse()
  if (isAdmin) categoriesKeyboard.text('Add new category', 'addcat').row()

  return categoriesKeyboard
}

export default async function handleStore(ctx: Context) {
  const isAdmin = env.ADMIN_IDS.includes(`${ctx.from?.id}`)

  const categories = await getCategories()

  const categoriesKeyboard = generateStoreKeyboard(categories, isAdmin)

  if (categories.length === 0)
    return categoriesKeyboard.text(ctx.t('noCategoryAvailable'))

  return ctx.reply(ctx.t('MainMenu'), {
    ...sendOptions(ctx),
    reply_markup: categoriesKeyboard,
  })
}
