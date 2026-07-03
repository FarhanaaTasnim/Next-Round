import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

export default function Register() {
  const navigate = useNavigate()
  const { register, loading } = useAuthStore()
  const [form, setForm] = useState({
    email: '', username: '', password: '',
    preferred_role: '', target_company: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await register(form)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setErrors(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">NextRound</h1>
          <p className="text-gray-400 mt-2">Create your account</p>
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
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Username</label>
              <input
                name="username" required
                value={form.username} onChange={handleChange}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-indigo-500 focus:outline-none"
                placeholder="yourname"
              />
              {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Password</label>
              <input
                name="password" type="password" required
                value={form.password} onChange={handleChange}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-indigo-500 focus:outline-none"
                placeholder="Min 8 characters"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Preferred role</label>
              <select
                name="preferred_role"
                value={form.preferred_role} onChange={handleChange}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Select a role</option>
                <option value="backend">Backend Developer</option>
                <option value="frontend">Frontend Developer</option>
                <option value="django">Django Developer</option>
                <option value="sqa">SQA Engineer</option>
                <option value="data">Data Scientist</option>
                <option value="software">Software Engineer</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Target company</label>
              <input
                name="target_company"
                value={form.target_company} onChange={handleChange}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-indigo-500 focus:outline-none"
                placeholder="Google, Amazon, local startup..."
              />
            </div>

            {errors.error && (
              <p className="text-red-400 text-sm text-center">{errors.error}</p>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}