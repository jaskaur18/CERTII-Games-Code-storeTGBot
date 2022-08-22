import { Menu } from '@grammyjs/menu'
import { getAllItemsBySubcategory, setPaid } from '@/models/Items'
import { getSubCategoryById } from '@/models/Categories'
import Context from '@/models/Context'

const resetStats = async (ctx: Context) => {
  await setPaid()
  return ctx.reply(`All Stats Has Been Reset`)
}

const resetStatsMenu = new Menu<Context>('resetStats').text(
  'Reset Stats',
  resetStats
)

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
    return ctx.reply(`SubcategoryId not found`)
  }

  const items = await getAllItemsBySubcategory(subCategoryId)

  if (items.length === 0) {
    return ctx.reply(`Id Is Incorrect Subcategory not found`)
  }

  const stats = {
    totalSold: 0,
    totalSouldUSD: 0,
    totalRefunded: 0,
    totalProfitUsd: 0,
  }

  items.map((item) => {
    if (!item.status.sold || item.status.refunded) return
    if (item.status.sold) {
      stats.totalSold += 1
      stats.totalSouldUSD += item.price
      if (item.status.refunded === false) {
        stats.totalProfitUsd += item.price
      }
    }
    if (item.status.refunded) {
      stats.totalRefunded = stats.totalRefunded + 1
    }
  })

  const message =
    `Stats For ${subCategory.name} (<code>${subCategory.id}</code>):\n\n` +
    `Total Items Sold - ${stats.totalSold}\n` +
    `Total Worth Of Items Sold - ${stats.totalSouldUSD}\n` +
    `Total Refunded - ${stats.totalRefunded}\n` +
    `Total Profit USD - ${stats.totalProfitUsd}\n`

  return ctx.reply(message, {
    reply_markup: resetStatsMenu,
    parse_mode: 'HTML',
  })
}
