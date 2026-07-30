import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Layout from '../components/Layout'

const PAGE_SIZE = 10

export default function History() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [sessions, setSessions] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE))

  const loadHistory = useCallback((pageNum) => {
    setLoading(true)
    setError(null)
    api.get(`/interviews/history/?page=${pageNum}&page_size=${PAGE_SIZE}`)
      .then(res => {
        setSessions(res.data.results)
        setCount(res.data.count)
        setPage(pageNum)
      })
      .catch(() => setError('Could not load your interview history right now.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadHistory(1)
    api.get('/analytics/dashboard/')
      .then(res => setStats(res.data))
      .catch(() => setStats(null))
  }, [loadHistory])

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-stone-800 dark:text-stone-100">
            Interview History
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
            {count > 0 ? `${count} total interview${count === 1 ? '' : 's'}` : 'All your past mock interviews'}
          </p>
        </div>

        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <StatCard label="Streak" value={`${stats.streak_days} 🔥`} />
            <StatCard label="XP" value={stats.xp_points} accent="purple" />
            <StatCard label="Interviews" value={stats.completed_interviews} accent="amber" />
            <StatCard label="Avg Score" value={`${stats.average_score}/10`} accent="emerald" />
          </div>
        )}

        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-rose-100 dark:border-stone-800 shadow-sm dark:shadow-none">
          {loading ? (
            <p className="text-stone-400 dark:text-stone-500 text-sm">Loading interview history...</p>
          ) : error ? (
            <p className="text-rose-500 text-sm">{error}</p>
          ) : sessions.length === 0 ? (
            <p className="text-stone-400 dark:text-stone-500 text-sm">
              No interviews yet — start your first one from the dashboard.
            </p>
          ) : (
            <>
              <div className="space-y-2">
                {sessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => navigate(s.status === 'completed' ? `/result/${s.id}` : `/interview/${s.id}`)}
                    className="w-full flex items-center justify-between bg-rose-50/60 dark:bg-stone-800 hover:bg-rose-100/70 dark:hover:bg-stone-700 rounded-2xl px-4 py-3 text-left transition"
                  >
                    <div>
                      <p className="font-medium capitalize text-stone-800 dark:text-stone-100">
                        {s.role} · {s.company}
                      </p>
                      <p className="text-stone-500 dark:text-stone-400 text-xs capitalize">
                        {s.difficulty} · {s.status} · {s.question_count} questions
                        {s.completed_at && ` · ${new Date(s.completed_at).toLocaleDateString()}`}
                      </p>
                    </div>
                    {s.total_score != null && (
                      <span className={`font-bold ${
                        s.total_score >= 7 ? 'text-emerald-500' :
                        s.total_score >= 4 ? 'text-amber-500' : 'text-rose-500'
                      }`}>
                        {s.total_score.toFixed(1)}/10
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-rose-100 dark:border-stone-800">
                  <button
                    onClick={() => loadHistory(page - 1)}
                    disabled={page <= 1}
                    className="text-sm font-medium px-4 py-2 rounded-full bg-rose-50 dark:bg-stone-800 text-rose-600 dark:text-rose-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-rose-100 dark:hover:bg-stone-700 transition"
                  >
                    ← Previous
                  </button>
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => loadHistory(page + 1)}
                    disabled={page >= totalPages}
                    className="text-sm font-medium px-4 py-2 rounded-full bg-rose-50 dark:bg-stone-800 text-rose-600 dark:text-rose-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-rose-100 dark:hover:bg-stone-700 transition"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
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
