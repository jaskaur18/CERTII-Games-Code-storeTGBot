import Coinbase from '@/helpers/Coinbase'
import Context from '@/models/Context'
import ccScraper from '@/helpers/ccGenerator'
import env from '@/helpers/env'
import sendOptions from '@/helpers/sendOptions'

export default async function handleHelp(ctx: Context) {
  const bin = ctx.msg?.text?.split(' ')[1]
  if (!bin) return ctx.reply('Bin Required')
  await ctx.reply('getting cc please wait wil get message')
  const cc = await ccScraper(bin)
  return ctx.reply(cc, sendOptions(ctx))
  return ctx.reply('help', sendOptions(ctx))
}
