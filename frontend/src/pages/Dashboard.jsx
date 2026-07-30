import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import api from '../api/axios'
import Layout from '../components/Layout'

export default function Dashboard() {
  const { user } = useAuthStore()
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
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-stone-800 dark:text-stone-100">
            Hello, {user?.username} 
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">Ready to practice today?</p>
        </div>

        <button
          onClick={() => navigate('/setup')}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-5 rounded-3xl text-lg transition mb-8 shadow-sm shadow-rose-200 dark:shadow-none"
        >
          Start Mock Interview →
        </button>

        {loading ? (
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-rose-100 dark:border-stone-800 shadow-sm dark:shadow-none">
            <p className="text-stone-400 dark:text-stone-500 text-sm">Loading your stats...</p>
          </div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <StatCard label="Streak" value={`${stats.streak_days} 🔥`} />
              <StatCard label="XP" value={stats.xp_points} accent="purple" />
              <StatCard label="Interviews" value={stats.completed_interviews} accent="amber" />
              <StatCard label="Avg Score" value={`${stats.average_score}/10`} accent="emerald" />
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-3xl p-4 sm:p-6 border border-rose-100 dark:border-stone-800 shadow-sm dark:shadow-none">
              <h2 className="font-display text-lg font-semibold text-stone-800 dark:text-stone-100 mb-4">
                Recent Interviews
              </h2>
              {stats.recent_sessions.length === 0 ? (
                <p className="text-stone-400 dark:text-stone-500 text-sm">
                  No interviews yet — start your first one above.
                </p>
              ) : (
                <div className="space-y-2">
                  {stats.recent_sessions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => navigate(s.status === 'completed' ? `/result/${s.id}` : `/interview/${s.id}`)}
                      className="w-full flex items-center justify-between gap-3 bg-rose-50/60 dark:bg-stone-800 hover:bg-rose-100/70 dark:hover:bg-stone-700 rounded-2xl px-4 py-3 text-left transition"
                    >
                      <div className="min-w-0">
                        <p className="font-medium capitalize text-stone-800 dark:text-stone-100 truncate">{s.role} · {s.company}</p>
                        <p className="text-stone-500 dark:text-stone-400 text-xs capitalize truncate">{s.difficulty} · {s.status}</p>
                      </div>
                      {s.total_score != null && (
                        <span className={`font-bold shrink-0 ${
                          s.total_score >= 7 ? 'text-emerald-500' :
                          s.total_score >= 4 ? 'text-amber-500' : 'text-rose-500'
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
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-rose-100 dark:border-stone-800 shadow-sm dark:shadow-none">
            <p className="text-stone-400 dark:text-stone-500 text-sm">Couldn't load your stats right now.</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

const accentMap = {
  rose: 'text-rose-500',
  purple: 'text-purple-500 dark:text-purple-400',
  amber: 'text-amber-500 dark:text-amber-400',
  emerald: 'text-emerald-500 dark:text-emerald-400',
}

function StatCard({ label, value, accent = 'rose' }) {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl p-4 border border-rose-100 dark:border-stone-800 shadow-sm dark:shadow-none text-center">
      <p className={`text-2xl font-bold ${accentMap[accent]}`}>{value}</p>
      <p className="text-stone-500 dark:text-stone-400 text-xs mt-1">{label}</p>
    </div>
  )
}