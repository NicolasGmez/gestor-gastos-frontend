import api from './api'
import type { User } from '../types/index'

export const authService = {
  async register(email: string, password: string, full_name: string): Promise<User> {
    const { data } = await api.post('/auth/register', { email, password, full_name })
    return data
  },

  async login(email: string, password: string): Promise<string> {
    const formData = new FormData()
    formData.append('username', email)
    formData.append('password', password)
    const { data } = await api.post('/auth/login', formData)
    localStorage.setItem('token', data.access_token)
    return data.access_token
  },

  logout() {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
}