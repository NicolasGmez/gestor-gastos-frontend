import api from './api'
import type { SavingsGoal, SavingsGoalCreate } from '../types/index'

export const savingsGoalService = {
  async getAll(): Promise<SavingsGoal[]> {
    const { data } = await api.get('/savings-goals/')
    return data
  },

  async create(goal: SavingsGoalCreate): Promise<SavingsGoal> {
    const { data } = await api.post('/savings-goals/', goal)
    return data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/savings-goals/${id}`)
  }
}