import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export default function Dashboard() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Hello, {user?.username} 👋</h1>
            <p className="text-gray-400 text-sm mt-1">Ready to practice?</p>
          </div>
          <button
            onClick={logout}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </div>

        <button
          onClick={() => navigate('/setup')}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-5 rounded-2xl text-lg transition mb-6"
        >
          Start Mock Interview →
        </button>

        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm">
            More dashboard features coming soon — history, analytics, streaks...
          </p>
        </div>
      </div>
    </div>
  )
}