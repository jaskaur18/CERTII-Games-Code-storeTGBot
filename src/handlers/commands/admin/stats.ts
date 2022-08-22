import { getSubCategoryById } from '@/models/Categories'
import Context from '@/models/Context'

export default async function handleStats(ctx: Context) {
  const userId = ctx.from?.id

  if (!userId) {
    return console.error('UserId not found')
  }

  const params = ctx.msg?.text?.split(' ')
  if (!params) {
    return ctx.reply(`Enter SubcategoryId \n\n` + `/stats <subcategoryid>`)
  }
  const subCategoryId = params[1]

  const subCategory = await getSubCategoryById(subCategoryId)

  if (!subCategory) {
    return ctx.reply(`Id Is Incorrect Subcategory not found`)
  }

  const message =
    `Stats For ${subCategory.name} (<code>${subCategory.id}</code>):\n\n` + ``
}
