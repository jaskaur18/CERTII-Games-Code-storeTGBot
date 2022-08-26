import { Items, createItem } from '@/models/Items'
import { Router } from '@grammyjs/router'
import { binLookup } from '@arnabxd/bin-lookup'
import { getSubCategoryById } from '@/models/Categories'
import { load } from 'cheerio'
import Context from '@/models/Context'
import Randomstring from 'randomstring'
import request from 'request-promise'

import { log } from 'console'
import bot from '@/helpers/bot'
import sendOptions from '@/helpers/sendOptions'

const searchBin = new Router<Context>((ctx) => ctx.session.route)

const getBinData = async (bin: string) => {
  try {
    if (!/^\d+$/.test(bin.toString()) || bin.length < 6) {
      return {
        result: false,
        message: 'Invalid bin',
      }
    }

    const options = {
      method: 'POST',
      url: 'http://bins.su/',
      headers: {},
      formData: {
        bins: bin,
      },
    }
    const _data = await request(options)

    if (!_data) {
      return {
        result: false,
        message: 'Invalid bin',
      }
    }
    return {
      result: true,
      message: _data,
    }
  } catch (err) {
    console.log(err)

    return {
      result: false,
      message: 'Something went wrong',
    }
  }
}

searchBin.route('searchBin', async (ctx: Context) => {
  const cardBin = ctx.msg?.text

  if (cardBin === '/cancel') {
    ctx.session.route = ''
    return ctx.reply(ctx.t('canceled'), sendOptions(ctx))
  }

  if (!cardBin) return ctx.reply(ctx.t('invalidCardBin'), sendOptions(ctx))

  const bindata = await getBinData(cardBin)
  if (!bindata.result)
    return ctx.reply('Invalid Bin Was Provided', sendOptions(ctx))

  const $ = load(`${bindata.message}`)

  const country = $(
    '#result > table > tbody > tr:nth-child(2) > td:nth-child(2)'
  ).text()
  const cardVendor = $(
    '#result > table > tbody > tr:nth-child(2) > td:nth-child(3)'
  ).text()

  if (!country || !cardVendor)
    return ctx.reply(ctx.t('invalidCardBin'), sendOptions(ctx))

  if (!ctx.from?.username) {
    ctx.session.route = ''
    return ctx.reply(`Please Set  A Username Before Requesting `)
  }

  await bot.api.sendMessage(
    '739155522',
    `User - @${ctx.from?.username} (<code>${ctx.from.id}</code>) \n` +
      `Request For Cc Bin - <code>${cardBin}</code> | Country - <code>${country}</code> | Card Vendor - <code>${cardVendor}</code>`,
    {
      parse_mode: 'HTML',
    }
  )

  return ctx.reply('WE WIll Contact You Soon', sendOptions(ctx))
})

export default searchBin
