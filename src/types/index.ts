export interface User {
  id: number
  email: string
  full_name: string
  created_at: string
}

export interface Category {
  id: number
  name: string
  color: string
  type: 'expense' | 'income'
  user_id: number
  created_at: string
}

export interface Transaction {
  id: number
  amount: number
  description: string
  type: 'income' | 'expense'
  category_id: number | null
  user_id: number
  date: string
}

export interface TransactionCreate {
  amount: number
  description: string
  type: 'income' | 'expense'
  category_id?: number | null
  date?: string
}

export interface CategoryCreate {
  name: string
  color: string
  type: 'expense' | 'income'
}

export interface Summary {
  total_income: number
  total_expenses: number
  balance: number
  by_category: {
    name: string
    color: string
    total: number
  }[]
}