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
export interface Budget {
  id: number
  amount: number
  category_id: number
  category_name: string
  category_color: string
  spent: number
  percentage: number
  month: number
  year: number
}

export interface BudgetCreate {
  amount: number
  category_id: number
  month: number
  year: number
}
export interface SavingsGoal {
  id: number
  name: string
  target_amount: number
  icon: string
  current_amount: number
  percentage: number
  remaining: number
}

export interface SavingsGoalCreate {
  name: string
  target_amount: number
  icon: string
}