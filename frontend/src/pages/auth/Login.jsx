import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import Layout from '../../components/Layout'

export default function Login() {
  const navigate = useNavigate()
  const { login, loading } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(form)
    if (result.success) navigate('/dashboard')
    else setError(result.error?.error || 'Login failed')
  }

  const inputClass = "w-full bg-rose-50/50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 rounded-xl px-4 py-3 border border-rose-100 dark:border-stone-700 focus:border-rose-400 dark:focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:focus:ring-rose-500/20 transition"

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-stone-800 dark:text-stone-100">Welcome back</h1>
            <p className="text-stone-500 dark:text-stone-400 mt-2">Sign in to keep your streak going</p>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 border border-rose-100 dark:border-stone-800 shadow-sm dark:shadow-none">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-stone-500 dark:text-stone-400 mb-1 block">Email</label>
                <input name="email" type="email" required value={form.email} onChange={handleChange} className={inputClass} placeholder="you@email.com" />
              </div>
              <div>
                <label className="text-sm text-stone-500 dark:text-stone-400 mb-1 block">Password</label>
                <input name="password" type="password" required value={form.password} onChange={handleChange} className={inputClass} placeholder="Your password" />
              </div>

              {error && <p className="text-rose-500 dark:text-rose-400 text-sm text-center">{error}</p>}

              <button
                type="submit" disabled={loading}
                className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition shadow-sm shadow-rose-200 dark:shadow-none"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <p className="text-center text-stone-500 dark:text-stone-400 text-sm mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-rose-500 dark:text-rose-400 font-medium hover:underline">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}