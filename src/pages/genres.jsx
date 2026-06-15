import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { GenreCard } from "@/components/movies/genre-card";

const GENRES = [
  { id: 28, name: "Action" },
  { id: 53, name: "Thriller" },
  { id: 80, name: "Crime" },
  { id: 9648, name: "Mystery" },
  { id: 878, name: "Sci-Fi" },
  { id: 99, name: "Documentary" },
  { id: 36, name: "History" },
  { id: 10402, name: "Biography" },
  { id: 12, name: "Adventure" },
  { id: 27, name: "Horror" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
];

export const Genres = () => {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-600/30 rounded-full px-4 py-1.5 mb-5">
            <Compass className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-medium">
              Genre Discovery
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            What Are You in the <span className="text-gradient">Mood For?</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Choose a genre to discover top-rated movies and TV shows tailored to
            your taste.
          </p>
        </motion.div>

        {/* Genre Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {GENRES.map((genre, idx) => (
            <GenreCard key={genre.id} genre={genre} index={idx} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center glass-card rounded-2xl p-10"
        >
          <h3 className="text-2xl font-bold text-white mb-3">
            Can't find what you're looking for?
          </h3>
          <p className="text-zinc-400 mb-6 text-sm">
            Search our full catalog of movies and TV shows.
          </p>
          <a
            href="/search"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Search Everything
          </a>
        </motion.div>
      </div>
    </div>
  );
};
