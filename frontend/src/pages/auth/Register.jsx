import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import Layout from '../../components/Layout'

export default function Register() {
  const navigate = useNavigate()
  const { register, loading } = useAuthStore()
  const [form, setForm] = useState({
    email: '', username: '', password: '', preferred_role: '', target_company: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await register(form)
    if (result.success) navigate('/dashboard')
    else setErrors(result.error)
  }

  const inputClass = "w-full bg-rose-50/50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 rounded-xl px-4 py-3 border border-rose-100 dark:border-stone-700 focus:border-rose-400 dark:focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:focus:ring-rose-500/20 transition text-base"

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 sm:py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100">Create your account</h1>
            <p className="text-stone-500 dark:text-stone-400 mt-2 text-sm sm:text-base">Start practicing in under a minute</p>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-rose-100 dark:border-stone-800 shadow-sm dark:shadow-none">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-stone-500 dark:text-stone-400 mb-1 block">Email</label>
                <input name="email" type="email" required value={form.email} onChange={handleChange} className={inputClass} placeholder="you@email.com" />
                {errors.email && <p className="text-rose-500 dark:text-rose-400 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="text-sm text-stone-500 dark:text-stone-400 mb-1 block">Username</label>
                <input name="username" required value={form.username} onChange={handleChange} className={inputClass} placeholder="yourname" />
                {errors.username && <p className="text-rose-500 dark:text-rose-400 text-xs mt-1">{errors.username}</p>}
              </div>

              <div>
                <label className="text-sm text-stone-500 dark:text-stone-400 mb-1 block">Password</label>
                <input name="password" type="password" required value={form.password} onChange={handleChange} className={inputClass} placeholder="Min 8 characters" />
                {errors.password && <p className="text-rose-500 dark:text-rose-400 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="text-sm text-stone-500 dark:text-stone-400 mb-1 block">Preferred role</label>
                <select name="preferred_role" value={form.preferred_role} onChange={handleChange} className={inputClass}>
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
                <label className="text-sm text-stone-500 dark:text-stone-400 mb-1 block">Target company</label>
                <input name="target_company" value={form.target_company} onChange={handleChange} className={inputClass} placeholder="Google, Amazon, local startup..." />
              </div>

              {errors.error && <p className="text-rose-500 dark:text-rose-400 text-sm text-center">{errors.error}</p>}

              <button
                type="submit" disabled={loading}
                className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition shadow-sm shadow-rose-200 dark:shadow-none"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <p className="text-center text-stone-500 dark:text-stone-400 text-sm mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-rose-500 dark:text-rose-400 font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}