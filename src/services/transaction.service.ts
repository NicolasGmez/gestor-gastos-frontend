import api from './api'
import type { Transaction, TransactionCreate, Summary } from '../types/index'

export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    const { data } = await api.get('/transactions/')
    return data
  },

  async create(transaction: TransactionCreate): Promise<Transaction> {
    const { data } = await api.post('/transactions/', transaction)
    return data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/transactions/${id}`)
  },

  async getSummary(): Promise<Summary> {
    const { data } = await api.get('/transactions/stats/summary')
    return data
  }
}
