import { NextFunction } from 'grammy'
import { findOrCreateUser } from '@/models/User'
import Context from '@/models/Context'

export default async function attachUser(ctx: Context, next: NextFunction) {
  if (!ctx.from) {
    throw new Error('No from field found')
  }
  const user = await findOrCreateUser(
    ctx.from.id,
    ctx.from.username ? ctx.from.username : '',
    ctx.from.first_name,
    ctx.from.last_name ? ctx.from.last_name : ''
  )

  if (!user) {
    throw new Error('User not found')
  }
  ctx.dbuser = user
  return next()
}