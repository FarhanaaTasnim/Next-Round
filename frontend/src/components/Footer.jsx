import {Link} from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-rose-100 dark:border-stone-800 bg-white/60 dark:bg-stone-950/60 mt-auto transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 text-sm">
          <Logo size={22} />
          <span>
            © {new Date().getFullYear()} NextRound. Practice makes ready.
          </span>
        </div>
        <div className="flex items-center gap-5 text-sm text-stone-500 dark:text-stone-400">
          <Link
            to="/"
            className="hover:text-rose-500 dark:hover:text-rose-400 transition">
            Home
          </Link>
          <a
            href="https://github.com/FarhanaaTasnim/Next-Round"
            target="_blank"
            rel="noreferrer"
            className="hover:text-rose-500 dark:hover:text-rose-400 transition">
            GitHub
          </a>
          <a
            href="mailto:farhana.tasnim.993@gmail.com"
            className="hover:text-rose-500 dark:hover:text-rose-400 transition">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
