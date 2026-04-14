import api from './api'
import type { Budget, BudgetCreate } from '../types/index'

export const budgetService = {
  async getAll(month?: number, year?: number): Promise<Budget[]> {
    const params = new URLSearchParams()
    if (month) params.append('month', month.toString())
    if (year) params.append('year', year.toString())
    const { data } = await api.get(`/budgets/?${params}`)
    return data
  },

  async create(budget: BudgetCreate): Promise<Budget> {
    const { data } = await api.post('/budgets/', budget)
    return data
  },

  async update(id: number, amount: number): Promise<Budget> {
    const { data } = await api.put(`/budgets/${id}`, { amount })
    return data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/budgets/${id}`)
  }
}