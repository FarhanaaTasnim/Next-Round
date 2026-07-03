import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

export default function Login() {
  const navigate = useNavigate()
  const { login, loading } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(form)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error?.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">NextRound</h1>
          <p className="text-gray-400 mt-2">Welcome back</p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Email</label>
              <input
                name="email" type="email" required
                value={form.email} onChange={handleChange}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-indigo-500 focus:outline-none"
                placeholder="you@email.com"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Password</label>
              <input
                name="password" type="password" required
                value={form.password} onChange={handleChange}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-indigo-500 focus:outline-none"
                placeholder="Your password"
              />
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button
              type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}