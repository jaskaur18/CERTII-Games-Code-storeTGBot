import { Router } from '@grammyjs/router'
import {
  findOrCreateCategories,
  findOrCreateSubCategories,
  getCategoryById,
} from '@/models/Categories'
import Context from '@/models/Context'
import randomString from 'randomstring'
import sendOptions from '@/helpers/sendOptions'

// Use router.
const addCategory = new Router<Context>((ctx) => ctx.session.route)

addCategory.route('addCategory', async (ctx: Context) => {
  if (!ctx.message?.text)
    return ctx.reply(ctx.t('enterValidName'), sendOptions(ctx))

  if (ctx.message.text === '/cancel') {
    ctx.session.route = ''
    return ctx.reply(ctx.t('canceled'), sendOptions(ctx))
  }

  const categoryId: string = randomString.generate({
    length: 6,
    charset: 'alphanumeric',
  })
  const categoryName = ctx.message.text
  const category = await findOrCreateCategories(categoryId, categoryName)
  ctx.session.route = ''
  return ctx.reply(
    ctx.t('categoryAdded', {
      id: category.id,
      name: category.name,
    }),
    sendOptions(ctx)
  )
})

addCategory.route('addSubCategoryId', async (ctx: Context) => {
  if (!ctx.message?.text)
    return ctx.reply(ctx.t('enterValidId'), sendOptions(ctx))

  if (ctx.message.text === '/cancel') {
    ctx.session.route = ''
    return ctx.reply(ctx.t('canceled'), sendOptions(ctx))
  }

  const parentCategory = await getCategoryById(ctx.message.text)

  if (!parentCategory) return ctx.reply(ctx.t('enterValidId'), sendOptions(ctx))

  ctx.session.categoryId = parentCategory.id
  ctx.session.route = 'addSubCategoryName'
  return ctx.reply(ctx.t('enterSubCategoryName'), sendOptions(ctx))
})

addCategory.route('addSubCategoryName', async (ctx: Context) => {
  if (!ctx.message?.text)
    return ctx.reply(ctx.t('enterValidName'), sendOptions(ctx))

  if (ctx.message.text === '/cancel') {
    ctx.session.route = ''
    return ctx.reply(ctx.t('canceled'), sendOptions(ctx))
  }

  const subCategoryId: string = randomString.generate({
    length: 6,
    charset: 'alphanumeric',
  })
  const subCategoryName = ctx.message.text

  const category = await findOrCreateSubCategories(
    `${subCategoryId}`,
    `${ctx.session.categoryId}`,
    `${subCategoryName}`
  )

  ctx.session.route = ''
  return ctx.reply(
    ctx.t('subCategoryAdded', {
      id: category.id,
      name: category.name,
    }),
    sendOptions(ctx)
  )
})

export default addCategory
