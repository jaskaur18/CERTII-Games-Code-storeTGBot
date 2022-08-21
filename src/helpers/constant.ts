import { Keyboard } from 'grammy'
import env from '@/helpers/env'

export const mainKeyboard = new Keyboard()
  .text('🛒 Store')
  .text('💵 Wallet')
  .row()
  .text('📝 Profile')
  .text('📖 Rules')

const AdminIds: string[] = env.ADMIN_IDS.split(',')
export default AdminIds
