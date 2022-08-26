import { getSubCategoryById } from '@/models/Categories'
import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'

export default async function handleChangePrice(ctx: Context) {
  const params = ctx.msg?.text?.split(' ')

  if (!params || params.length < 2) {
    return ctx.reply(
      'Please Enter Valid SubcategoryId And Price Format - /changeprice subcategoryid price',
      sendOptions(ctx)
    )
  }

  const subcategoryId = params[1]
  const price = params[2]

  const subcategory = await getSubCategoryById(subcategoryId)
}
