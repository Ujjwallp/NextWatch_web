import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  TrendingUp,
  Compass,
  Play,
  Star,
  Bookmark,
  Clock,
  Flame,
} from "lucide-react";
import {
  getTrending,
  getPopularMovies,
  getImageUrl,
  getBackdropUrl,
  getYear,
} from "@/services/tmdb";
import { MovieCard } from "@/components/movies/movie-card";
import { SearchBar } from "@/components/movies/search-bar";
import { SectionSkeleton } from "@/components/ui/skeleton";
import { useWatchlist } from "@/contexts/watchlist-context";

const GENRES = [
  { id: 28, name: "Action" },
  { id: 53, name: "Thriller" },
  { id: 80, name: "Crime" },
  { id: 9648, name: "Mystery" },
  { id: 878, name: "Sci-Fi" },
  { id: 99, name: "Documentary" },
  { id: 36, name: "History" },
  { id: 12, name: "Adventure" },
  { id: 27, name: "Horror" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
];

const GENRE_EMOJIS = {
  Action: "💥",
  Thriller: "🔪",
  Crime: "🕵️",
  Mystery: "🔮",
  "Sci-Fi": "🚀",
  Documentary: "🎬",
  History: "🏛️",
  Adventure: "🗺️",
  Horror: "👻",
  Comedy: "😄",
  Drama: "🎭",
};

const HeroSlide = ({ item, isActive }) => {
  const backdrop = getBackdropUrl(item.backdrop_path, "w1280");
  const title = item.title || item.name;
  const mediaType = item.media_type || "movie";
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0"
    >
      {backdrop && (
        <>
          <img
            src={backdrop}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090B] via-[#09090B]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-[#09090B]/30" />
        </>
      )}
    </motion.div>
  );
};

export const Home = () => {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [popularLoading, setPopularLoading] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const { stats } = useWatchlist();
  const navigate = useNavigate();


  useEffect(() => {
    try {
      const stored = localStorage.getItem("nextwatch_recently_viewed");
      if (stored) setRecentlyViewed(JSON.parse(stored).slice(0, 8));
    } catch {

    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTrending("all", "day");
        setTrending(data.results || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    const loadPopular = async () => {
      try {
        const data = await getPopularMovies();
        setPopular(data.results || []);
      } catch (e) {
        console.error(e);
      } finally {
        setPopularLoading(false);
      }
    };
    load();
    loadPopular();
  }, []);

  useEffect(() => {
    if (trending.length === 0) return;
    const timer = setInterval(() => {
      setHeroIndex((i) => (i + 1) % Math.min(5, trending.length));
    }, 5000);
    return () => clearInterval(timer);
  }, [trending]);

  const heroItem = trending[heroIndex];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        {trending.slice(0, 5).map((item, idx) => (
          <HeroSlide key={item.id} item={item} isActive={idx === heroIndex} />
        ))}

        {!heroItem && <div className="absolute inset-0 hero-gradient" />}

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Tag */}
              <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-600/30 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-400 text-sm font-medium">
                  Movie Discovery Platform
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-5">
                What Should You{" "}
                <span className="text-gradient">Watch Tonight?</span>
              </h1>

              {/* Subheading */}
              <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed mb-8 max-w-xl">
                Discover the perfect movie or show in seconds. Browse by genre,
                explore trending titles, and find where to stream everything.
              </p>

              {/* Search bar */}
              <div className="mb-8 max-w-xl">
                <SearchBar placeholder="Search any movie or TV show..." large />
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/genres">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-red-600/30"
                  >
                    <Compass className="w-5 h-5" />
                    Explore Genres
                  </motion.button>
                </Link>
                <Link to="/trending">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    <TrendingUp className="w-5 h-5" />
                    Trending Now
                  </motion.button>
                </Link>
                {stats.total > 0 && (
                  <Link to="/watchlist">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-400 px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                      <Bookmark className="w-5 h-5" />
                      My Watchlist ({stats.total})
                    </motion.button>
                  </Link>
                )}
              </div>
            </motion.div>

            {/* Hero item info */}
            {heroItem && (
              <motion.div
                key={heroIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-12 flex items-center gap-4"
              >
                <div className="w-0.5 h-10 bg-red-500 rounded-full" />
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-1">
                    Trending Now
                  </p>
                  <p className="text-white font-semibold text-sm">
                    {heroItem.title || heroItem.name}
                  </p>
                </div>
                <Link
                  to={`/details/${heroItem.media_type || "movie"}/${heroItem.id}`}
                  className="ml-2 flex items-center gap-1 text-red-400 text-xs hover:text-red-300 transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  Details
                </Link>
              </motion.div>
            )}
          </div>

          {/* Hero indicator dots */}
          {trending.length > 0 && (
            <div className="absolute bottom-8 left-4 sm:left-6 flex gap-2">
              {trending.slice(0, 5).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setHeroIndex(idx)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === heroIndex ? "w-8 bg-red-500" : "w-2 bg-white/30"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <TrendingUp className="w-7 h-7 text-red-500" />
              Trending Today
            </h2>
            <p className="text-zinc-500 text-sm mt-1">
              What everyone's watching right now
            </p>
          </div>
          <Link
            to="/trending"
            className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <SectionSkeleton count={12} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {trending.slice(0, 12).map((item, idx) => (
              <MovieCard key={item.id} item={item} index={idx} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Movies Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <Flame className="w-7 h-7 text-amber-500" />
              Popular Movies
            </h2>
            <p className="text-zinc-500 text-sm mt-1">
              Most popular titles on NextWatch
            </p>
          </div>
        </div>

        {popularLoading ? (
          <SectionSkeleton count={12} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {popular.slice(0, 12).map((item, idx) => (
              <MovieCard key={item.id} item={item} index={idx} />
            ))}
          </div>
        )}
      </section>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                <Clock className="w-7 h-7 text-zinc-400" />
                Recently Viewed
              </h2>
              <p className="text-zinc-500 text-sm mt-1">
                Pick up where you left off
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {recentlyViewed.map((item, idx) => (
              <MovieCard
                key={`${item.id}-${item.media_type}`}
                item={item}
                index={idx}
              />
            ))}
          </div>
        </section>
      )}

      {/* Genre Quick Select */}
      <section className="py-16 bg-[#18181B]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                <Compass className="w-7 h-7 text-amber-500" />
                Browse by Genre
              </h2>
              <p className="text-zinc-500 text-sm mt-1">
                Find exactly what you're in the mood for
              </p>
            </div>
            <Link
              to="/genres"
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
            >
              All Genres <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {GENRES.map((genre, idx) => (
              <motion.div
                key={genre.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.04 }}
              >
                <Link
                  to={`/recommendations/${genre.id}?name=${encodeURIComponent(genre.name)}`}
                  className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-[#18181B] border border-white/5 hover:border-white/20 hover:bg-[#27272A] transition-all duration-200 text-center"
                >
                  <span className="text-3xl">
                    {GENRE_EMOJIS[genre.name] || "🎬"}
                  </span>
                  <span className="text-white text-sm font-medium">
                    {genre.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / Feature Highlights */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "🎬",
              title: "Thousands of Titles",
              desc: "Browse movies and TV shows across every genre imaginable.",
            },
            {
              icon: "📡",
              title: "Where to Stream",
              desc: "Instantly see which streaming platforms carry each title.",
            },
            {
              icon: "🔖",
              title: "Personal Watchlist",
              desc: "Save anything for later — no account required.",
            },
          ].map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <span className="text-4xl mb-4 block">{feat.icon}</span>
              <h3 className="text-white font-bold text-lg mb-2">
                {feat.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
