import { Items, createItem } from '@/models/Items'
import { Router } from '@grammyjs/router'
import { getSubCategoryById } from '@/models/Categories'
import Context from '@/models/Context'
import Randomstring from 'randomstring'
import axios from 'axios'
import env from '@/helpers/env'
import sendOptions from '@/helpers/sendOptions'

const addItemsRouter = new Router<Context>((ctx) => ctx.session.route)

addItemsRouter.route('addItemsId', async (ctx: Context) => {
  if (!ctx.message?.text)
    return ctx.reply(ctx.t('ItemsInvalidId'), sendOptions(ctx))

  if (ctx.message.text === '/cancel') {
    ctx.session.route = ''
    return ctx.reply(ctx.t('canceled'), sendOptions(ctx))
  }

  const subCateogry = await getSubCategoryById(ctx.message.text)

  if (!subCateogry) return ctx.reply(ctx.t('ItemsInvalidId'), sendOptions(ctx))

  ctx.session.subCategoryId = subCateogry.id
  ctx.session.categoryId = subCateogry.parentCategoryId
  ctx.session.route = 'addItemsPrice'
  return ctx.reply(ctx.t('ItemPrice'), sendOptions(ctx))
})

addItemsRouter.route('addItemsPrice', (ctx: Context) => {
  if (!ctx.message?.text)
    return ctx.reply(ctx.t('ItemsInvalidId'), sendOptions(ctx))

  if (ctx.message.text === '/cancel') {
    ctx.session.route = ''
    return ctx.reply(ctx.t('canceled'), sendOptions(ctx))
  }

  const price = ctx.message.text

  if (isNaN(Number(price)))
    return ctx.reply(ctx.t('ItemsInvalidPrice'), sendOptions(ctx))

  ctx.session.price = Number(ctx.message.text)
  ctx.session.route = 'addItemName'
  return ctx.reply(ctx.t('ItemName'), sendOptions(ctx))
})

addItemsRouter.route('addItemName', (ctx: Context) => {
  if (!ctx.message?.text)
    return ctx.reply(ctx.t('InvaliItemName'), sendOptions(ctx))

  if (ctx.message.text === '/cancel') {
    ctx.session.route = ''
    return ctx.reply(ctx.t('canceled'), sendOptions(ctx))
  }

  const itemName = ctx.message.text

  ctx.session.name = itemName
  ctx.session.route = 'addItemsTxt'
  return ctx.reply(ctx.t('ItemsTxtMsg'), sendOptions(ctx))
})

addItemsRouter.route('addItemsTxt', async (ctx: Context) => {
  if (ctx.message?.text === '/cancel') {
    ctx.session.route = ''
    return ctx.reply(ctx.t('canceled'), sendOptions(ctx))
  }

  if (!ctx.msg?.text)
    return ctx.reply(ctx.t('ItemsTxtInvalid'), sendOptions(ctx))

  const content = ctx.msg.text

  // const imageUrl = (await ctx.api.getFile(image)).file_path

  // if (!imageUrl) return false

  // const imageContainNumber = await axios
  //   .get(`https://api.telegram.org/file/bot${env.TOKEN}/${imageUrl}`)
  //   .catch(() => undefined)

  // if (!imageContainNumber)
  //   return ctx.reply(ctx.t('ItemsTxtInvalid'), sendOptions(ctx))

  // const imageContainNumberText: string = imageContainNumber.data.toString()

  // const imageContainNumberTextArray =
  //   imageContainNumberText.split('---START---')

  // //remove empty and \r\n array element
  // const imageContainNumberTextArrayWithoutEmpty =
  //   imageContainNumberTextArray.filter((item) => item !== '' && item !== '\r\n')

  // if (imageContainNumberTextArrayWithoutEmpty.length === 0)
  //   return ctx.reply(ctx.t('ItemsTxtInvalid'), sendOptions(ctx))

  // const itemsArray: Items[] = []

  // imageContainNumberTextArrayWithoutEmpty.map((item, index) => {
  //   const itemId = Randomstring.generate({
  //     length: 6,
  //     charset: 'alphanumeric',
  //   })

  //   const cardBin = Number(item.split('card_bin : ')?.[1]?.split('\n')?.[0])

  //   if (!cardBin) {
  //     console.log('cardBin is undefined')
  //     return ctx.reply(ctx.t('ItemsTxtInvalid'), sendOptions(ctx))
  //   }

  //   const cardNumber = Number(
  //     item.split('card_number : ')?.[1]?.split('\n')?.[0]
  //   )

  //   if (!cardNumber) {
  //     console.log('cardNumber is undefined')
  //     return ctx.reply(ctx.t('ItemsTxtInvalid'), sendOptions(ctx))
  //   }

  //   //get current date format MM/DD/YY
  //   const date = new Date()

  //   const formatDate =
  //     date.getMonth() > 8
  //       ? date.getMonth() + 1
  //       : '0' +
  //         (date.getMonth() + 1) +
  //         '/' +
  //         (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) +
  //         '/' +
  //         date.getFullYear().toString().slice(2, 4)

  //   const postCode = item
  //     .split('zip_code :  ')?.[1]
  //     ?.split('\n')?.[0]
  //     ?.replace('\r', '')
  //     ?.replace(/\s/g, '')

  //   if (!postCode) {
  //     console.log('postCode is undefined')
  //     return ctx.reply(ctx.t('ItemsTxtInvalid'), sendOptions(ctx))
  //   }

  //   //const name = last 6 digit of card number and DOB.slice(6, 8) and post
  //   const name = `${cardBin.toString()} ${formatDate} ${postCode}`

  // itemsArray.push({
  //   id: itemId,
  //   CategoryId: ctx.session.categoryId,
  //   subCategoryId: ctx.session.subCategoryId,
  //   name: name,
  //   price: ctx.session.price,
  //   cardNumber,

  //   postCode,
  //   text: item,
  //   paid: false,
  //   status: {
  //     purchasedOn: '',
  //     sold: false,
  //     refunded: false,
  //     purchasedBy: 0,
  //   },
  // })
  // })

  const itemId = Randomstring.generate({
    length: 6,
    charset: 'alphanumeric',
  })

  try {
    await createItem({
      id: itemId,
      CategoryId: ctx.session.categoryId,
      subCategoryId: ctx.session.subCategoryId,
      name: ctx.session.name,
      paid: false,
      price: ctx.session.price,
      text: content,
      status: {
        purchasedOn: '',
        sold: false,
        refunded: false,
        purchasedBy: 0,
      },
    })
  } catch (e) {
    console.log(`error when create item ${itemId}`)
  }

  ctx.session.route = ''
  return ctx.reply(ctx.t('ItemsAdded'), sendOptions(ctx))
})

export default addItemsRouter

// const cardBin = Number(item.split('Card BIN : ')?.[1]?.split('\n')?.[0])

// if (!cardBin) {
//   console.log('cardBin is undefined')
//   return ctx.reply(ctx.t('ItemsTxtInvalid'), sendOptions(ctx))
// }

// const cardNumber = Number(
//   item.split('Card Number : ')?.[1]?.split('\n')?.[0]
// )
// if (!cardNumber) {
//   console.log('cardNumber is undefined')
//   return ctx.reply(ctx.t('ItemsTxtInvalid'), sendOptions(ctx))
// }

// const DOBYear = item
//   .split('Date of birth :  ')?.[1]
//   ?.split('/')?.[2]
//   ?.split('\n')?.[0]
//   ?.replace('\r', '')

// if (!DOBYear) {
//   console.log('DOBYear is undefined')
//   return ctx.reply(ctx.t('ItemsTxtInvalid'), sendOptions(ctx))
// }
// const postCode = item
//   .split('Address :  ')?.[1]
//   ?.split(',')?.[2]
//   ?.split('\n')?.[0]
//   ?.replace('\r', '')
//   ?.replace(/\s/g, '')

// if (!postCode) {
//   console.log('postCode is undefined')
//   return ctx.reply(ctx.t('ItemsTxtInvalid'), sendOptions(ctx))
// }

// //const name = last 6 digit of card number and DOB.slice(6, 8) and post
// const name = `${cardBin.toString()} ${DOBYear} ${postCode}`
