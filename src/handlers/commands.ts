import { Composer } from 'grammy'
import Context from '@/models/Context'
import handleHelp from '@/handlers/commands/help'
import handleLanguage from '@/handlers/commands/language'
import handleStart from '@/handlers/commands/start'
import handleaddItems from '@/handlers/commands/admin/addItems'

const CommandsHanlder = new Composer<Context>()

CommandsHanlder.command('start', handleStart)
CommandsHanlder.command('cc', handleHelp)
CommandsHanlder.command('language', handleLanguage)
CommandsHanlder.command('additem', handleaddItems)

export default CommandsHanlder
