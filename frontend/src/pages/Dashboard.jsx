import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import api from '../api/axios'

export default function Dashboard() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/analytics/dashboard/')
      .then(res => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Hello, {user?.username}</h1>
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

        {loading ? (
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm">Loading your stats...</p>
          </div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <StatCard label="Streak" value={`${stats.streak_days} 🔥`} />
              <StatCard label="XP" value={stats.xp_points} />
              <StatCard label="Interviews" value={stats.completed_interviews} />
              <StatCard label="Avg Score" value={`${stats.average_score}/10`} />
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h2 className="text-lg font-semibold mb-4">Recent Interviews</h2>
              {stats.recent_sessions.length === 0 ? (
                <p className="text-gray-400 text-sm">
                  No interviews yet — start your first one above.
                </p>
              ) : (
                <div className="space-y-2">
                  {stats.recent_sessions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => navigate(
                        s.status === 'completed' ? `/result/${s.id}` : `/interview/${s.id}`
                      )}
                      className="w-full flex items-center justify-between bg-gray-800 hover:bg-gray-700 rounded-xl px-4 py-3 text-left transition"
                    >
                      <div>
                        <p className="font-medium capitalize">{s.role} · {s.company}</p>
                        <p className="text-gray-400 text-xs capitalize">{s.difficulty} · {s.status}</p>
                      </div>
                      {s.total_score != null && (
                        <span className={`font-bold ${
                          s.total_score >= 7 ? 'text-green-400' :
                          s.total_score >= 4 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {s.total_score.toFixed(1)}/10
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm">Couldn't load your stats right now.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-gray-400 text-xs mt-1">{label}</p>
    </div>
  )
}