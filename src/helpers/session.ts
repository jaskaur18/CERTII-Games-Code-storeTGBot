import { session as session_ } from 'grammy'

export interface Session {
  route: string
  itemId: string
  price: number
  categoryId: string
  subCategoryId: string
}

export const initial = (): Session => ({
  route: '',
  itemId: '',
  price: 0,
  categoryId: '',
  subCategoryId: '',
})

export const session = session_({ initial })
