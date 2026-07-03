import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const roles = [
  { value: 'backend', label: 'Backend Developer' },
  { value: 'frontend', label: 'Frontend Developer' },
  { value: 'django', label: 'Django Developer' },
  { value: 'sqa', label: 'SQA Engineer' },
  { value: 'data', label: 'Data Scientist' },
  { value: 'software', label: 'Software Engineer' },
]

const difficulties = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

const companies = [
  { value: 'google', label: 'Google' },
  { value: 'microsoft', label: 'Microsoft' },
  { value: 'amazon', label: 'Amazon' },
  { value: 'netflix', label: 'Netflix' },
  { value: 'openai', label: 'OpenAI' },
  { value: 'local', label: 'Local Company' },
]

export default function InterviewSetup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    role: '', difficulty: '', company: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.role || !form.difficulty || !form.company) {
      setError('Please select all options')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/interviews/start/', form)
      navigate(`/interview/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to start interview')
      setLoading(false)
    }
  }

  const SelectCard = ({ options, field, label }) => (
    <div>
      <p className="text-gray-400 text-sm mb-3">{label}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setForm({ ...form, [field]: opt.value })}
            className={`py-3 px-4 rounded-xl text-sm font-medium border transition
              ${form[field] === opt.value
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-indigo-500'
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Start Interview</h1>
          <p className="text-gray-400 mt-1">Configure your mock interview session</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-6">
            <SelectCard options={roles} field="role" label="Select role" />
            <SelectCard options={difficulties} field="difficulty" label="Select difficulty" />
            <SelectCard options={companies} field="company" label="Select company" />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Generating questions...
              </span>
            ) : 'Start Mock Interview →'}
          </button>
        </form>
      </div>
    </div>
  )
}