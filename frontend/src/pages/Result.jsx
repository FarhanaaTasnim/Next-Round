import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Layout from '../components/Layout'

export default function Result() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)

  useEffect(() => {
    api.get(`/interviews/${sessionId}/`)
      .then(res => setSession(res.data))
      .catch(() => navigate('/dashboard'))
  }, [sessionId])

  if (!session) return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-stone-500 dark:text-stone-400">Loading results...</p>
      </div>
    </Layout>
  )

  const questions = session.questions || []
  const scored = questions.filter(q => q.answer?.feedback)
  const avg = scored.length
    ? (scored.reduce((s, q) => s + q.answer.feedback.score, 0) / scored.length).toFixed(1)
    : 0

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* Score card */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 border border-rose-100 dark:border-stone-800 shadow-sm dark:shadow-none text-center">
          <p className="text-stone-500 dark:text-stone-400 mb-2">Interview Complete</p>
          <div className={`text-6xl font-bold mb-2 ${
            avg >= 7 ? 'text-emerald-500' : avg >= 4 ? 'text-amber-500' : 'text-rose-500'
          }`}>
            {session.total_score ?? avg}
            <span className="text-2xl text-stone-400 dark:text-stone-600">/10</span>
          </div>
          <p className="text-stone-500 dark:text-stone-400 capitalize">
            {session.role} · {session.company} · {session.difficulty}
          </p>
          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={() => navigate('/setup')}
              className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-full text-sm font-medium transition shadow-sm shadow-rose-200 dark:shadow-none"
            >
              New Interview
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-rose-50 dark:bg-stone-800 hover:bg-rose-100 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 px-6 py-2 rounded-full text-sm font-medium transition"
            >
              Dashboard
            </button>
          </div>
        </div>

        {/* Per-question breakdown */}
        <h2 className="font-display text-lg font-semibold text-stone-800 dark:text-stone-100">Question Breakdown</h2>
        {questions.map((q, i) => (
          <div key={q.id} className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-rose-100 dark:border-stone-800 shadow-sm dark:shadow-none space-y-3">
            <div className="flex items-start justify-between gap-4">
              <p className="text-stone-800 dark:text-stone-100 font-medium">Q{i + 1}. {q.text}</p>
              {q.answer?.feedback && (
                <span className={`shrink-0 text-lg font-bold ${
                  q.answer.feedback.score >= 7 ? 'text-emerald-500' :
                  q.answer.feedback.score >= 4 ? 'text-amber-500' : 'text-rose-500'
                }`}>
                  {q.answer.feedback.score}/10
                </span>
              )}
            </div>

            {q.answer && (
              <div className="bg-rose-50/60 dark:bg-stone-800 rounded-2xl p-3">
                <p className="text-stone-400 dark:text-stone-500 text-xs mb-1">Your answer</p>
                <p className="text-stone-600 dark:text-stone-300 text-sm">{q.answer.text}</p>
              </div>
            )}

            {q.answer?.feedback && (
              <>
                {q.answer.feedback.problems?.length > 0 && (
                  <div>
                    <p className="text-rose-500 dark:text-rose-400 text-xs mb-1">Issues</p>
                    {q.answer.feedback.problems.map((p, j) => (
                      <p key={j} className="text-stone-600 dark:text-stone-300 text-sm">✗ {p}</p>
                    ))}
                  </div>
                )}
                <div>
                  <p className="text-emerald-500 dark:text-emerald-400 text-xs mb-1">Ideal answer</p>
                  <p className="text-stone-600 dark:text-stone-300 text-sm">{q.answer.feedback.correct_answer}</p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </Layout>
  )
}