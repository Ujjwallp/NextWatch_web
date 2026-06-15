import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Flame, Calendar } from "lucide-react";
import { getTrending } from "@/services/tmdb";
import { MovieGrid } from "@/components/movies/movie-grid";

export const Trending = () => {
  const [timeWindow, setTimeWindow] = useState("day");
  const [mediaType, setMediaType] = useState("all");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTrending(mediaType, timeWindow);
      setData(result.results || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [timeWindow, mediaType]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-1.5 mb-5">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">Trending</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            What's <span className="text-gradient">Hot Right Now</span>
          </h1>
          <p className="text-zinc-400 text-lg">
            The most popular movies and shows everyone's talking about.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Time Window */}
          <div className="flex gap-2">
            <button
              onClick={() => setTimeWindow("day")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                timeWindow === "day"
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/25"
                  : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Flame className="w-4 h-4" />
              Today
            </button>
            <button
              onClick={() => setTimeWindow("week")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                timeWindow === "week"
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/25"
                  : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Calendar className="w-4 h-4" />
              This Week
            </button>
          </div>

          {/* Media Type */}
          <div className="flex gap-2">
            {["all", "movie", "tv"].map((type) => (
              <button
                key={type}
                onClick={() => setMediaType(type)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                  mediaType === type
                    ? "bg-amber-500 text-black font-semibold"
                    : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {type === "all"
                  ? "All"
                  : type === "movie"
                    ? "Movies"
                    : "TV Shows"}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        {!loading && !error && (
          <p className="text-zinc-500 text-sm mb-6">
            Showing {data.length} trending{" "}
            {timeWindow === "day" ? "today" : "this week"}
          </p>
        )}

        <MovieGrid
          items={data}
          loading={loading}
          error={error}
          onRetry={load}
          emptyTitle="No trending content"
          emptyDescription="Check back later for trending movies and shows."
        />
      </div>
    </div>
  );
};
