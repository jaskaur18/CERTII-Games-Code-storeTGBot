import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: { timestamps: true },
  options: {
    allowMixed: 0,
  },
})
export class Items {
  @prop({ required: true, index: true, unique: true })
  id!: string

  @prop({ required: true })
  name!: string

  @prop({ required: true })
  subCategoryId!: string

  @prop({ required: true })
  CategoryId!: string

  @prop({ required: true })
  cardNumber!: number

  @prop({ required: true })
  price!: number

  @prop({ required: true })
  postCode!: string

  @prop({ required: true })
  text!: string

  @prop({ required: true, default: false })
  paid!: boolean

  @prop({ required: true, default: {} })
  status!: {
    sold: boolean
    refunded: boolean
    purchasedBy: number
    purchasedOn: Date | string
  }
}

const ItemsModel = getModelForClass(Items)

//create new item
export const createItem = async (item: Items) => {
  const newItem = new ItemsModel(item)
  return await newItem.save()
}

//get item by id
export const getItemById = async (id: string) => {
  return await ItemsModel.findOne({ id })
}

//get all unsold items
export const getAllUnsoldItemsBySubcategory = async (subCategoryId: string) => {
  return await ItemsModel.find({
    subCategoryId,
    status: { purchasedOn: '', sold: false, refunded: false, purchasedBy: 0 },
  })
}

export const getAllItemsBySubcategory = async (subCategoryId: string) => {
  return await ItemsModel.find({
    subCategoryId,
  })
}

// status: { sold: false, refunded: false },

//get all sold items
export const getAllSoldItems = async () => {
  return await ItemsModel.find({ status: { sold: true } })
}

//set status to sold + usedBy
export const setStatusToSold = async (id: string, purchasedBy: number) => {
  const todaysDate = new Date()
  return await ItemsModel.findOneAndUpdate(
    { id },
    {
      $set: {
        status: {
          purchasedOn: todaysDate,
          sold: true,
          refunded: false,
          purchasedBy,
        },
      },
    }
  )
}

//set status to refunded
export const setStatusToRefunded = async (id: string) => {
  return await ItemsModel.findOneAndUpdate(
    { id },
    {
      $set: {
        status: {
          refunded: true,
        },
      },
    }
  )
}

//get frequency of same card number used in all items
export const getCardNumberUsage = async (subCategoryId: string) => {
  const _items = await ItemsModel.find({
    subCategoryId,
    status: { purchasedOn: '', sold: false, refunded: false, purchasedBy: 0 },
  })

  const cardsCount: {
    cardNumber: number
    count: number
  }[] = []

  _items.forEach((item) => {
    const cardNumber = item.cardNumber
    const index = cardsCount.findIndex((card) => card.cardNumber === cardNumber)
    if (index === -1) {
      cardsCount.push({ cardNumber, count: 1 })
    } else {
      cardsCount[index].count++
    }
  })
  return cardsCount
}

//set refund true
export const setRefund = async (id: string) => {
  return await ItemsModel.updateOne(
    { id },
    {
      $set: {
        status: {
          refunded: true,
        },
      },
    }
  )
}

export const setPaid = async () => {
  const items = await ItemsModel.find({
    status: {
      sold: true,
      refunded: true,
    },
  })

  items.map((item) => {
    item.status.refunded = true
    return item.save()
  })
}

export default ItemsModel
