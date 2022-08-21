import { Composer } from 'grammy'
import Context from '@/models/Context'
import handleProfile from '@/handlers/hears/Profile'
import handleRules from '@/handlers/hears/Rules'
import handleStore from '@/handlers/hears/Store'
import handleWallet from '@/handlers/hears/Wallet'

const HearsHanlder = new Composer<Context>()

HearsHanlder.hears(/🛒 Store/, handleStore)
HearsHanlder.hears(/💵 Wallet/, handleWallet)
HearsHanlder.hears(/📝 Profile/, handleProfile)
HearsHanlder.hears(/📖 Rules/, handleRules)

export default HearsHanlder
