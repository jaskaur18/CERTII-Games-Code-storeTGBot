import { Composer } from 'grammy'
import { generateStoreKeyboard } from '@/handlers/hears/Store'
import { getCategories } from '@/models/Categories'
import Context from '@/models/Context'
import handleAddCategory from '@/handlers/actions/addCategory'
import handleCategory from '@/handlers/actions/Category'
import handleDeposit from '@/handlers/actions/deposit'
import handleSubCategory from '@/handlers/actions/SubCategory'
import handlepurchaseItem from '@/handlers/actions/purchaseItem'
import sendOptions from '@/helpers/sendOptions'

const actionHandler = new Composer<Context>()

actionHandler.callbackQuery(/cat;(.*?);(.*?)/, handleCategory)
actionHandler.callbackQuery(/sub;(.*?)/, handleSubCategory)
actionHandler.callbackQuery(/addcat/, handleAddCategory)
actionHandler.callbackQuery(/addsub/, handleAddCategory)
actionHandler.callbackQuery(/submenu;(.*?)/, handleCategory)
actionHandler.callbackQuery(/item;(.*?)/, handlepurchaseItem)
actionHandler.callbackQuery(/deposit;(.*?)/, handleDeposit)

////////////////////////////////////////////////////////////////////////////////
actionHandler.callbackQuery('menu', async (ctx: Context) => {
  const categories = await getCategories()
  const categoriesKeyboard = generateStoreKeyboard(categories)

  await ctx.answerCallbackQuery({
    text: 'Main Menu',
  })
  return ctx.editMessageText(ctx.t('MainMenu'), {
    ...sendOptions(ctx),
    reply_markup: categoriesKeyboard,
  })
})
export default actionHandler
