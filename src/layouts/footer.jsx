import { Link } from "react-router-dom";
import { Film } from "lucide-react";

export const Footer = () => (
  <footer className="bg-[#09090B] border-t border-white/5 mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
              <Film className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">
              Next<span className="text-red-500">Watch</span>
            </span>
          </div>
          <p className="text-zinc-500 text-xs">Movie Discovery Platform</p>
        </div>

        <div className="flex items-center gap-6 text-sm text-zinc-500">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/genres" className="hover:text-white transition-colors">
            Genres
          </Link>
          <Link to="/trending" className="hover:text-white transition-colors">
            Trending
          </Link>
          <Link to="/watchlist" className="hover:text-white transition-colors">
            Watchlist
          </Link>
        </div>

        <div className="flex flex-col items-center md:items-end gap-1 text-xs text-zinc-600">
          <span>
            Powered by{" "}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
            >
              TMDB
            </a>
          </span>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center justify-center gap-3 text-xs text-zinc-500">
        <p className="font-medium text-zinc-400 text-sm">
          Designed & Developed by Ujjwal Prakash
        </p>
        <p className="text-center">
          Technology Stack: React • Vite • Tailwind CSS • Framer Motion • React
          Router • Lucide
        </p>
        <span className="text-center text-zinc-700 mt-2">
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </span>
      </div>
    </div>
  </footer>
);
