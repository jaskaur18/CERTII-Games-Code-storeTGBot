import { Context as BaseContext, SessionFlavor } from 'grammy'
import { DocumentType } from '@typegoose/typegoose'
import { FluentContextFlavor } from '@grammyjs/fluent'
import { HydrateFlavor } from '@grammyjs/hydrate'
import { Session } from '@/helpers/session'
import { User } from '@/models/User'

class MyContext extends BaseContext {
  dbuser!: DocumentType<User>
}
type Context = HydrateFlavor<MyContext> &
  FluentContextFlavor &
  SessionFlavor<Session>

export default Context
