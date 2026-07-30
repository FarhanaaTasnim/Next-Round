import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Layout from '../components/Layout'

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
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-rose-400 mx-auto mb-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <p className="text-stone-500 dark:text-stone-400">Loading your interview...</p>
        </div>
      </div>
    </Layout>
  )

  const questions = session?.questions || []
  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return
    setSubmitting(true)
    try {
      const res = await api.post(`/interviews/${sessionId}/answer/`, {
        question_id: currentQuestion.id,
        answer_text: answer,
      })
      setFeedback(res.data.feedback)
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
    <Layout>
      {/* Progress bar */}
      <div className="h-1 bg-rose-100 dark:bg-stone-800">
        <div
          className="h-1 bg-rose-400 transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* Session meta */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-rose-500 dark:text-rose-400 font-medium capitalize">{session?.company}</span>
            <span className="text-stone-300 dark:text-stone-600 mx-2">·</span>
            <span className="text-stone-500 dark:text-stone-400 capitalize">{session?.role}</span>
            <span className="text-stone-300 dark:text-stone-600 mx-2">·</span>
            <span className="text-stone-500 dark:text-stone-400 capitalize">{session?.difficulty}</span>
          </div>
          <span className="text-stone-400 dark:text-stone-500 text-sm">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        {/* Question */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-rose-100 dark:border-stone-800 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
              Q{currentIndex + 1}
            </span>
            <span className="text-stone-400 dark:text-stone-500 text-xs capitalize">
              {currentQuestion?.question_type}
            </span>
            {currentQuestion?.topic && (
              <span className="text-stone-400 dark:text-stone-500 text-xs">· {currentQuestion.topic}</span>
            )}
          </div>
          <p className="text-stone-800 dark:text-stone-100 text-lg leading-relaxed">{currentQuestion?.text}</p>
        </div>

        {/* Answer area */}
        {!currentQuestion?.answer && !feedback && (
          <div className="space-y-3">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={6}
              className="w-full bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 rounded-2xl px-5 py-4 border border-rose-100 dark:border-stone-800 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:focus:ring-rose-500/20 resize-none transition"
            />
            <button
              onClick={handleSubmitAnswer}
              disabled={submitting || !answer.trim()}
              className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-semibold py-3 rounded-2xl transition shadow-sm shadow-rose-200 dark:shadow-none"
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
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-rose-100 dark:border-stone-800 shadow-sm dark:shadow-none">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-lg text-stone-800 dark:text-stone-100">AI Feedback</h3>
                <div className={`text-2xl font-bold ${
                  feedback.score >= 7 ? 'text-emerald-500' :
                  feedback.score >= 4 ? 'text-amber-500' : 'text-rose-500'
                }`}>
                  {feedback.score}/10
                </div>
              </div>

              {feedback.problems?.length > 0 && (
                <div className="mb-4">
                  <p className="text-rose-500 dark:text-rose-400 text-sm font-medium mb-2">Issues found</p>
                  <ul className="space-y-1">
                    {feedback.problems.map((p, i) => (
                      <li key={i} className="text-stone-600 dark:text-stone-300 text-sm flex gap-2">
                        <span className="text-rose-500 dark:text-rose-400 mt-0.5">✗</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-4">
                <p className="text-emerald-500 dark:text-emerald-400 text-sm font-medium mb-2">Ideal answer</p>
                <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed bg-rose-50/60 dark:bg-stone-800 rounded-2xl p-4">
                  {feedback.correct_answer}
                </p>
              </div>

              {feedback.tips?.length > 0 && (
                <div>
                  <p className="text-purple-500 dark:text-purple-400 text-sm font-medium mb-2">Study tips</p>
                  <ul className="space-y-1">
                    {feedback.tips.map((t, i) => (
                      <li key={i} className="text-stone-600 dark:text-stone-300 text-sm flex gap-2">
                        <span className="text-purple-500 dark:text-purple-400">→</span> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {!isLastQuestion ? (
              <button
                onClick={handleNext}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-2xl transition shadow-sm shadow-rose-200 dark:shadow-none"
              >
                Next Question →
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={completing}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-3 rounded-2xl transition shadow-sm shadow-emerald-200 dark:shadow-none"
              >
                {completing ? 'Finishing...' : 'Complete Interview →'}
              </button>
            )}
          </div>
        )}

        {/* Already answered */}
        {currentQuestion?.answer && !feedback && (
          <div className="text-center py-4">
            <p className="text-stone-400 dark:text-stone-500 text-sm">Already answered</p>
            {!isLastQuestion ? (
              <button onClick={handleNext} className="mt-3 text-rose-500 dark:text-rose-400 hover:underline text-sm">
                Next question →
              </button>
            ) : (
              <button onClick={handleComplete} className="mt-3 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm transition">
                Complete Interview
              </button>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}