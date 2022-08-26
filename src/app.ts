import 'module-alias/register'
import 'reflect-metadata'
import 'source-map-support/register'

import { confirmDepositKeyboard } from '@/handlers/actions/deposit'
import { development, production } from '@/helpers/launch'
import { hydrate } from '@grammyjs/hydrate'
import { ignoreOld, sequentialize } from 'grammy-middlewares'
import { limit } from '@grammyjs/ratelimiter'
import { loadLocales } from '@/helpers/i18n'
import { session } from '@/helpers/session'
import CommandsHanlder from '@/handlers/commands'
import HearsHanlder from '@/handlers/hears'
import actionHandler from '@/handlers/action'
import addCategory from '@/conversation/addCategory'
import addItemsRouter from '@/conversation/addItems'
import attachUser from '@/middlewares/attachUser'
import bot from '@/helpers/bot'
import configurefluent from '@/middlewares/configurefluent'
import env from '@/helpers/env'
import languageMenu from '@/menus/language'
import refundRouter from '@/conversation/refund'
import searchBin from '@/conversation/searchBin'
import startMongo from '@/helpers/startMongo'

async function runApp() {
  console.log('Starting Bot...')
  // Mongo
  await startMongo()
  console.log('MongoDB connected')
  bot
    // Middlewares
    .use(sequentialize())
    .use(ignoreOld())
    .use(attachUser)
    .use(limit())
    .use(hydrate())
    // Add fluent middleware to the bot
    .use(configurefluent())
    //Sessions
    .use(session)
    // Menus
    //Menu
    .use(confirmDepositKeyboard)
    .use(languageMenu)
    .use(addCategory) // register the router
    .use(addItemsRouter) // register the router
    .use(refundRouter, searchBin)

    // Commands
    .use(CommandsHanlder)
    //Actions (inline queries)
    .use(actionHandler)
    //Hears (Keyboard)
    .use(HearsHanlder)

  await loadLocales()
  await (env.isDev ? development(bot) : production(bot))
}

void runApp()
