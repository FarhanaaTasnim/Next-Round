import { Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user, logout } = useAuthStore()

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-rose-100 dark:border-stone-800 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 font-display font-bold text-xl text-stone-800 dark:text-stone-100">
          {/* <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-400 to-purple-400 flex items-center justify-center text-white text-sm">
           
          </span> */}
          NextRound
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <nav className="flex items-center gap-2 sm:gap-4">
              <Link to="/dashboard" className="text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-rose-500 dark:hover:text-rose-400 transition px-2 py-1">
                Dashboard
              </Link>
              <Link to="/setup" className="text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-rose-500 dark:hover:text-rose-400 transition px-2 py-1">
                New Interview
              </Link>
              <div className="w-px h-5 bg-rose-100 dark:bg-stone-800 mx-1 hidden sm:block" />
              <span className="hidden sm:block text-sm text-stone-500 dark:text-stone-400">Hi, {user.username}</span>
              <button
                onClick={logout}
                className="text-sm font-medium bg-rose-50 dark:bg-stone-800 hover:bg-rose-100 dark:hover:bg-stone-700 text-rose-600 dark:text-rose-400 px-4 py-2 rounded-full transition"
              >
                Logout
              </button>
            </nav>
          ) : (
            <nav className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-rose-500 dark:hover:text-rose-400 transition px-3 py-2">
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-full transition shadow-sm shadow-rose-200 dark:shadow-none"
              >
                Get started
              </Link>
            </nav>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}