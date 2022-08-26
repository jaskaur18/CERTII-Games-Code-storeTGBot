import { InlineKeyboard } from 'grammy'
import {
  getAllUnsoldItemsBySubcategory,
  getCardNumberUsage,
} from '@/models/Items'
import { getCategoryById, getSubCategoryById } from '@/models/Categories'
import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export default async function handleSubCategory(ctx: Context) {
  const callbackData = ctx.callbackQuery?.data?.split(';')
  const id = callbackData?.[1]
  const page = Number(callbackData?.[2]) || 1

  if (!id)
    return ctx.answerCallbackQuery({
      text: ctx.t('InvalidSubCategory'),
      show_alert: true,
    })

  if (id === 'search') {
    ctx.session.route = 'searchBin'
    return ctx.editMessageText(ctx.t('enterBin'), {
      reply_markup: undefined,
    })
  }

  const subcategory = await getSubCategoryById(id)
  if (!subcategory)
    return ctx.answerCallbackQuery({
      text: ctx.t('InvalidSubCategory'),
      show_alert: true,
    })

  const parentCategory = await getCategoryById(subcategory.parentCategoryId)

  if (!parentCategory)
    return ctx.answerCallbackQuery({
      text: ctx.t('InvalidSubCategory'),
      show_alert: true,
    })

  const items = await getAllUnsoldItemsBySubcategory(id)

  const ItemsKeyboard = new InlineKeyboard()

  if (!items.length) {
    ItemsKeyboard.text(ctx.t('NoItemsAvailable')).row()
    await ctx.answerCallbackQuery({
      text: ctx.t('NoItemsAvailable'),
    })
  } else {
    await ctx.answerCallbackQuery({
      text: ctx.t('ItemsFound', {
        count: items.length,
      }),
    })
  }

  const itemsPerPage = 5

  //skip items according to page 50 items per page
  const itemsToShow = items.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  //current items postion from pagination
  let currentPage = page * itemsPerPage

  currentPage = currentPage > items.length ? items.length : currentPage

  itemsToShow.forEach((item, index) => {
    ItemsKeyboard.text(`${item.name} - $${item.price}`, `item;${item.id}`).row()
  })

  //if has more items to then add next button
  if (items.length > currentPage) {
    ItemsKeyboard.text(ctx.t('Next'), `sub;${id};${page + 1}`)
  }
  //if has previous items to then add previous button
  if (page > 1) {
    ItemsKeyboard.text(ctx.t('Previous'), `sub;${id};${page - 1}`)
  }

  ItemsKeyboard.row()

  ItemsKeyboard.text(
    'Sub Menu',
    `submenu;${parentCategory?.name};${parentCategory.id}`
  ).row()

  const cardsCount: {
    name: string
    cardNumber: number
    count: number
  }[] = []

  itemsToShow.map((item) => {
    const cardNumber = item.cardNumber
    const index = cardsCount.findIndex((card) => card.cardNumber === cardNumber)
    if (index === -1) {
      cardsCount.push({ name: item.name, cardNumber, count: 1 })
    } else {
      cardsCount[index].count++
    }
  })

  const message =
    `<code>---${subcategory.name}---</code>\n` +
    `Showing ${currentPage} of ${items.length} items\n` +
    `${cardsCount
      .map((card) => `${card.name.split(' ')[0]} - x${card.count}`)
      .join('\n')}`

  return ctx.editMessageText(message, {
    ...sendOptions(ctx),
    reply_markup: ItemsKeyboard,
  })
}
