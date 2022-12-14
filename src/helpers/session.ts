import { session as session_ } from 'grammy'

export interface Session {
  route: string
  name: string
  itemId: string
  price: number
  categoryId: string
  subCategoryId: string
  refundAttempts: number
}

export const initial = (): Session => ({
  route: '',
  name: '',
  itemId: '',
  price: 0,
  categoryId: '',
  subCategoryId: '',
  refundAttempts: 0,
})

export const session = session_({ initial })
