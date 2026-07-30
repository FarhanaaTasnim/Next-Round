import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

const features = [
  { emoji: '🧠', title: 'AI-generated questions', desc: 'Get interview questions tailored to your role, seniority, and target company — powered by AI.' },
  { emoji: '📝', title: 'Instant, honest feedback', desc: 'Every answer is scored with clear notes on what to fix and what a strong answer looks like.' },
  { emoji: '🔥', title: 'Streaks & XP', desc: 'Build a practice habit with streaks and XP that grow every time you show up.' },
  { emoji: '📊', title: 'Track your progress', desc: 'See your average score and interview history in one clean dashboard.' },
]

const companies = ['Google', 'Microsoft', 'Amazon', 'Netflix', 'OpenAI', 'Local Startups']

export default function Home() {
  return (
    <Layout>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-14 sm:pb-20 text-center">
        <span className="inline-block bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-300 text-xs font-semibold px-3 py-1 rounded-full mb-5">
          Your next interview, rehearsed
        </span>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-stone-800 dark:text-stone-100 leading-tight mb-5">
          Practice interviews that feel<br className="hidden sm:block" /> a little less scary.
        </h1>
        <p className="text-stone-500 dark:text-stone-400 text-base sm:text-lg max-w-xl mx-auto mb-10">
          NextRound gives you role-specific mock interviews, instant AI feedback, and a gentle
          nudge to keep practicing — so the real one feels familiar.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/register"
            className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 text-white font-semibold px-7 py-3 rounded-full shadow-sm shadow-rose-200 dark:shadow-none transition"
          >
            Start practicing free
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto text-stone-600 dark:text-stone-300 hover:text-rose-500 dark:hover:text-rose-400 font-medium px-7 py-3 rounded-full border border-stone-200 dark:border-stone-700 hover:border-rose-200 dark:hover:border-rose-400 transition"
          >
            I have an account
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-14 sm:pb-20">
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-rose-100 dark:border-stone-800 shadow-sm hover:shadow-md dark:shadow-none transition"
            >
              <div className="text-3xl mb-3">{f.emoji}</div>
              <h3 className="font-display font-semibold text-stone-800 dark:text-stone-100 mb-1">{f.title}</h3>
              <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24 text-center">
        <p className="text-stone-400 dark:text-stone-500 text-sm font-medium mb-4 uppercase tracking-wide">
          Practice for interviews styled after
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {companies.map((c) => (
            <span key={c} className="bg-white dark:bg-stone-900 border border-rose-100 dark:border-stone-800 text-stone-600 dark:text-stone-300 text-sm px-3 sm:px-4 py-2 rounded-full">
              {c}
            </span>
          ))}
        </div>
      </section>
    </Layout>
  )
}