import { createWallet } from '@/helpers/Wallet'
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: { timestamps: true },
  options: {
    allowMixed: 0,
  },
})
export class User {
  @prop({ required: true, index: true, unique: true })
  id!: number

  @prop({ required: false, default: 'none', lowercase: true })
  username!: string

  @prop({ required: true, lowercase: true })
  first_name!: string

  @prop({ required: false, lowercase: true })
  last_name!: string

  @prop({ required: true, default: 'en' })
  language!: string

  @prop({ required: true, default: [] })
  purchases!: {
    id: number
    itemName: string
    itemPrice: number
    refund: boolean
  }[]

  @prop({ required: true, default: '' })
  walletAddress!: string

  @prop({ required: true, default: 0 })
  balance!: number
}

const UserModel = getModelForClass(User)

export async function findOrCreateUser(
  id: number,
  username: string | undefined,
  first_name: string,
  last_name: string | undefined
) {
  const user = await UserModel.findOne({ id })
  if (user) {
    return user
  }
  const walletAddress = await createWallet()

  if (!walletAddress) {
    console.log('Error creating wallet')
    return false
  }
  return UserModel.create({
    id,
    username,
    first_name,
    last_name,
    walletAddress,
  })
}

//addBalance
export function addBalance(id: number, balance: number) {
  return UserModel.findOneAndUpdate(
    { id },
    { $inc: { balance } },
    { new: true }
  )
}

//reduce balance
export function reduceBalance(id: number, balance: number) {
  return UserModel.findOneAndUpdate({ id }, { $inc: { balance: -balance } })
}

//regenrate wallet address
export async function regenrateWalletAddress(id: number) {
  const walletAddress = await createWallet()
  if (!walletAddress) {
    console.log('Error creating wallet')
    return false
  }
  return UserModel.findOneAndUpdate({ id }, { $set: { walletAddress } })
}
