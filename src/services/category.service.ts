import api from './api'
import type { Category, CategoryCreate } from '../types/index'

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const { data } = await api.get('/categories/')
    return data
  },

  async create(category: CategoryCreate): Promise<Category> {
    const { data } = await api.post('/categories/', category)
    return data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/categories/${id}`)
  }
}