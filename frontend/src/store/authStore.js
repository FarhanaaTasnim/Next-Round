import { create } from 'zustand'
import api from '../api/axios'

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  loading: false,
  error: null,

  register: async (data) => {
    set({ loading: true, error: null })
    try {
      const res = await api.post('/users/register/', data)
      const { user, tokens } = res.data
      localStorage.setItem('access_token', tokens.access)
      localStorage.setItem('refresh_token', tokens.refresh)
      localStorage.setItem('user', JSON.stringify(user))
      set({ user, loading: false })
      return { success: true }
    } catch (err) {
      const error = err.response?.data || { error: 'Registration failed' }
      set({ error, loading: false })
      return { success: false, error }
    }
  },

  login: async (data) => {
    set({ loading: true, error: null })
    try {
      const res = await api.post('/users/login/', data)
      const { user, tokens } = res.data
      localStorage.setItem('access_token', tokens.access)
      localStorage.setItem('refresh_token', tokens.refresh)
      localStorage.setItem('user', JSON.stringify(user))
      set({ user, loading: false })
      return { success: true }
    } catch (err) {
      const error = err.response?.data || { error: 'Login failed' }
      set({ error, loading: false })
      return { success: false, error }
    }
  },

  logout: () => {
    localStorage.clear()
    set({ user: null })
    window.location.href = '/login'
  },
}))

export default useAuthStore