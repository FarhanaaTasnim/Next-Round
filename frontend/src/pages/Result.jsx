import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'

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
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400">Loading results...</p>
    </div>
  )

  const questions = session.questions || []
  const scored = questions.filter(q => q.answer?.feedback)
  const avg = scored.length
    ? (scored.reduce((s, q) => s + q.answer.feedback.score, 0) / scored.length).toFixed(1)
    : 0

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Score card */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 text-center">
          <p className="text-gray-400 mb-2">Interview Complete</p>
          <div className={`text-6xl font-bold mb-2 ${
            avg >= 7 ? 'text-green-400' : avg >= 4 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {session.total_score ?? avg}
            <span className="text-2xl text-gray-500">/10</span>
          </div>
          <p className="text-gray-400 capitalize">
            {session.role} · {session.company} · {session.difficulty}
          </p>
          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={() => navigate('/setup')}
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-xl text-sm font-medium transition"
            >
              New Interview
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded-xl text-sm font-medium transition"
            >
              Dashboard
            </button>
          </div>
        </div>

        {/* Per-question breakdown */}
        <h2 className="text-lg font-semibold">Question Breakdown</h2>
        {questions.map((q, i) => (
          <div key={q.id} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <p className="text-white font-medium">Q{i + 1}. {q.text}</p>
              {q.answer?.feedback && (
                <span className={`shrink-0 text-lg font-bold ${
                  q.answer.feedback.score >= 7 ? 'text-green-400' :
                  q.answer.feedback.score >= 4 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {q.answer.feedback.score}/10
                </span>
              )}
            </div>

            {q.answer && (
              <div className="bg-gray-800 rounded-xl p-3">
                <p className="text-gray-400 text-xs mb-1">Your answer</p>
                <p className="text-gray-300 text-sm">{q.answer.text}</p>
              </div>
            )}

            {q.answer?.feedback && (
              <>
                {q.answer.feedback.problems?.length > 0 && (
                  <div>
                    <p className="text-red-400 text-xs mb-1">Issues</p>
                    {q.answer.feedback.problems.map((p, j) => (
                      <p key={j} className="text-gray-300 text-sm">✗ {p}</p>
                    ))}
                  </div>
                )}
                <div>
                  <p className="text-green-400 text-xs mb-1">Ideal answer</p>
                  <p className="text-gray-300 text-sm">{q.answer.feedback.correct_answer}</p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}