import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Compass, Search } from "lucide-react";

export const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-md"
    >
      <div className="text-8xl font-black text-gradient mb-4">404</div>
      <h1 className="text-3xl font-bold text-white mb-3">Page Not Found</h1>
      <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
        The page you're looking for doesn't exist. But don't worry — there's
        plenty to discover on NextWatch.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          to="/"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
        >
          <Home className="w-4 h-4" />
          Home
        </Link>
        <Link
          to="/genres"
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
        >
          <Compass className="w-4 h-4" />
          Genres
        </Link>
        <Link
          to="/search"
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
        >
          <Search className="w-4 h-4" />
          Search
        </Link>
      </div>
    </motion.div>
  </div>
);
