import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import useAuthStore from "../store/authStore";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);

  const linkClass =
    "text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-rose-500 dark:hover:text-rose-400 transition px-2 py-1";

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-rose-100 dark:border-stone-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link
          to={user ? "/dashboard" : "/"}
          className="flex items-center gap-2 font-display font-bold text-lg sm:text-xl text-stone-800 dark:text-stone-100 shrink-0"
        >
          <Logo size={32} />
          NextRound
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <nav className="flex items-center gap-4">
              <Link to="/dashboard" className={linkClass}>Dashboard</Link>
              <Link to="/setup" className={linkClass}>New Interview</Link>
              <Link to="/history" className={linkClass}>History</Link>
              <div className="w-px h-5 bg-rose-100 dark:bg-stone-800 mx-1" />
              <span className="text-sm text-stone-500 dark:text-stone-400">{user.username}</span>
              <button
                onClick={logout}
                className="text-sm font-medium bg-rose-50 dark:bg-stone-800 hover:bg-rose-100 dark:hover:bg-stone-700 text-rose-600 dark:text-rose-400 px-4 py-2 rounded-full transition"
              >
                Logout
              </button>
            </nav>
          ) : (
            <nav className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-rose-500 dark:hover:text-rose-400 transition px-3 py-2"
              >
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

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-rose-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {open && (
        <div className="md:hidden border-t border-rose-100 dark:border-stone-800 bg-white dark:bg-stone-950 px-4 py-3">
          {user ? (
            <div className="flex flex-col gap-1">
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="px-2 py-3 rounded-xl text-stone-700 dark:text-stone-200 hover:bg-rose-50 dark:hover:bg-stone-800 font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/setup"
                onClick={() => setOpen(false)}
                className="px-2 py-3 rounded-xl text-stone-700 dark:text-stone-200 hover:bg-rose-50 dark:hover:bg-stone-800 font-medium"
              >
                New Interview
              </Link>
              <Link
                to="/history"
                onClick={() => setOpen(false)}
                className="px-2 py-3 rounded-xl text-stone-700 dark:text-stone-200 hover:bg-rose-50 dark:hover:bg-stone-800 font-medium"
              >
                History
              </Link>
              <div className="h-px bg-rose-100 dark:bg-stone-800 my-1" />
              <div className="px-2 py-2 text-sm text-stone-500 dark:text-stone-400">{user.username}</div>
              <button
                onClick={() => { setOpen(false); logout(); }}
                className="mx-2 mt-1 text-sm font-medium bg-rose-50 dark:bg-stone-800 hover:bg-rose-100 dark:hover:bg-stone-700 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-xl transition text-center"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="px-2 py-3 rounded-xl text-stone-700 dark:text-stone-200 hover:bg-rose-50 dark:hover:bg-stone-800 font-medium text-center"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="text-sm font-semibold bg-rose-500 hover:bg-rose-600 text-white px-4 py-3 rounded-xl transition text-center"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}