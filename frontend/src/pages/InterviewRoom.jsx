import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function InterviewRoom() {
  const { sessionId } = useParams()
  const navigate = useNavigate()

  const [session, setSession] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    api.get(`/interviews/${sessionId}/`)
      .then(res => { setSession(res.data); setLoading(false) })
      .catch(() => navigate('/dashboard'))
  }, [sessionId])

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <svg className="animate-spin h-10 w-10 text-indigo-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <p className="text-gray-400">Loading your interview...</p>
      </div>
    </div>
  )

  const questions = session?.questions || []
  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1
  const allAnswered = questions.every(q => q.answer)

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return
    setSubmitting(true)
    try {
      const res = await api.post(`/interviews/${sessionId}/answer/`, {
        question_id: currentQuestion.id,
        answer_text: answer,
      })
      setFeedback(res.data.feedback)

      // Refresh session to update answered state
      const updated = await api.get(`/interviews/${sessionId}/`)
      setSession(updated.data)
    } catch (err) {
      console.error(err)
    }
    setSubmitting(false)
  }

  const handleNext = () => {
    setFeedback(null)
    setAnswer('')
    setCurrentIndex(currentIndex + 1)
  }

  const handleComplete = async () => {
    setCompleting(true)
    try {
      await api.post(`/interviews/${sessionId}/complete/`)
      navigate(`/result/${sessionId}`)
    } catch (err) {
      console.error(err)
      setCompleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <span className="text-indigo-400 font-medium capitalize">{session?.company}</span>
          <span className="text-gray-600 mx-2">·</span>
          <span className="text-gray-400 capitalize">{session?.role}</span>
          <span className="text-gray-600 mx-2">·</span>
          <span className="text-gray-400 capitalize">{session?.difficulty}</span>
        </div>
        <span className="text-gray-400 text-sm">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-800">
        <div
          className="h-1 bg-indigo-500 transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* Question */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
              Q{currentIndex + 1}
            </span>
            <span className="text-gray-500 text-xs capitalize">
              {currentQuestion?.question_type}
            </span>
            {currentQuestion?.topic && (
              <span className="text-gray-500 text-xs">· {currentQuestion.topic}</span>
            )}
          </div>
          <p className="text-white text-lg leading-relaxed">{currentQuestion?.text}</p>
        </div>

        {/* Answer area — hide if already answered */}
        {!currentQuestion?.answer && !feedback && (
          <div className="space-y-3">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={6}
              className="w-full bg-gray-900 text-white rounded-2xl px-5 py-4 border border-gray-800 focus:border-indigo-500 focus:outline-none resize-none"
            />
            <button
              onClick={handleSubmitAnswer}
              disabled={submitting || !answer.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Evaluating your answer...
                </span>
              ) : 'Submit Answer'}
            </button>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className="space-y-4">
            {/* Score */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">AI Feedback</h3>
                <div className={`text-2xl font-bold ${
                  feedback.score >= 7 ? 'text-green-400' :
                  feedback.score >= 4 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {feedback.score}/10
                </div>
              </div>

              {/* Problems */}
              {feedback.problems?.length > 0 && (
                <div className="mb-4">
                  <p className="text-red-400 text-sm font-medium mb-2">Issues found</p>
                  <ul className="space-y-1">
                    {feedback.problems.map((p, i) => (
                      <li key={i} className="text-gray-300 text-sm flex gap-2">
                        <span className="text-red-400 mt-0.5">✗</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ideal answer */}
              <div className="mb-4">
                <p className="text-green-400 text-sm font-medium mb-2">Ideal answer</p>
                <p className="text-gray-300 text-sm leading-relaxed bg-gray-800 rounded-xl p-4">
                  {feedback.correct_answer}
                </p>
              </div>

              {/* Tips */}
              {feedback.tips?.length > 0 && (
                <div>
                  <p className="text-indigo-400 text-sm font-medium mb-2">Study tips</p>
                  <ul className="space-y-1">
                    {feedback.tips.map((t, i) => (
                      <li key={i} className="text-gray-300 text-sm flex gap-2">
                        <span className="text-indigo-400">→</span> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Navigation */}
            {!isLastQuestion ? (
              <button
                onClick={handleNext}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition"
              >
                Next Question →
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={completing}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
              >
                {completing ? 'Finishing...' : 'Complete Interview →'}
              </button>
            )}
          </div>
        )}

        {/* Already answered state */}
        {currentQuestion?.answer && !feedback && (
          <div className="text-center py-4">
            <p className="text-gray-400 text-sm">Already answered</p>
            {!isLastQuestion ? (
              <button onClick={handleNext} className="mt-3 text-indigo-400 hover:underline text-sm">
                Next question →
              </button>
            ) : (
              <button onClick={handleComplete} className="mt-3 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl text-sm">
                Complete Interview
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}