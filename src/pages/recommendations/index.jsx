import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Star, Flame, ChevronLeft, Film, Tv } from "lucide-react";
import {
  getPopularByGenre,
  getTopRatedByGenre,
  getTrending,
} from "@/services/tmdb";
import { MovieGrid } from "@/components/movie-grid";
import { SectionSkeleton } from "@/components/ui/skeleton";

const GENRE_EMOJIS = {
  Action: "💥",
  Thriller: "🔪",
  Crime: "🕵️",
  Mystery: "🔮",
  "Sci-Fi": "🚀",
  Documentary: "🎬",
  History: "🏛️",
  Biography: "📖",
  Adventure: "🗺️",
  Horror: "👻",
  Comedy: "😄",
  Drama: "🎭",
};

const TV_GENRE_MAP = {
  28: 10759, // Action -> Action & Adventure
  53: 9648, // Thriller -> Mystery
  80: 80, // Crime
  9648: 9648, // Mystery
  878: 10765, // Sci-Fi -> Sci-Fi & Fantasy
  99: 99, // Documentary
  36: 36, // History
  10402: 10402,
  12: 10759, // Adventure -> Action & Adventure
  27: 27, // Horror
  35: 35, // Comedy
  18: 18, // Drama
};

const Section = ({
  title,
  icon: Icon,
  iconColor,
  items,
  loading,
  error,
  onRetry,
  mediaType,
  onMediaTypeChange,
}) => (
  <div className="mb-14">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
        <Icon className={`w-6 h-6 ${iconColor}`} />
        {title}
      </h2>
      <div className="flex gap-2">
        <button
          onClick={() => onMediaTypeChange("movie")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mediaType === "movie"
              ? "bg-red-600 text-white"
              : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10"
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          Movies
        </button>
        <button
          onClick={() => onMediaTypeChange("tv")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mediaType === "tv"
              ? "bg-blue-600 text-white"
              : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10"
          }`}
        >
          <Tv className="w-3.5 h-3.5" />
          TV Shows
        </button>
      </div>
    </div>
    <MovieGrid
      items={items}
      loading={loading}
      error={error}
      onRetry={onRetry}
    />
  </div>
);

export const Recommendations = () => {
  const { genreId } = useParams();
  const [searchParams] = useSearchParams();
  const genreName = searchParams.get("name") || "Genre";

  const [popularMediaType, setPopularMediaType] = useState("movie");
  const [topRatedMediaType, setTopRatedMediaType] = useState("movie");

  const [popularData, setPopularData] = useState([]);
  const [topRatedData, setTopRatedData] = useState([]);
  const [trendingData, setTrendingData] = useState([]);

  const [popularLoading, setPopularLoading] = useState(true);
  const [topRatedLoading, setTopRatedLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(true);

  const [popularError, setPopularError] = useState(null);
  const [topRatedError, setTopRatedError] = useState(null);
  const [trendingError, setTrendingError] = useState(null);

  const numericGenreId = parseInt(genreId);
  const tvGenreId = TV_GENRE_MAP[numericGenreId] || numericGenreId;

  const loadPopular = async () => {
    setPopularLoading(true);
    setPopularError(null);
    try {
      const effectiveId =
        popularMediaType === "tv" ? tvGenreId : numericGenreId;
      const data = await getPopularByGenre(effectiveId, popularMediaType);
      setPopularData(
        (data.results || []).map((item) => ({
          ...item,
          media_type: popularMediaType,
        })),
      );
    } catch (e) {
      setPopularError(e.message);
    } finally {
      setPopularLoading(false);
    }
  };

  const loadTopRated = async () => {
    setTopRatedLoading(true);
    setTopRatedError(null);
    try {
      const effectiveId =
        topRatedMediaType === "tv" ? tvGenreId : numericGenreId;
      const data = await getTopRatedByGenre(effectiveId, topRatedMediaType);
      setTopRatedData(
        (data.results || []).map((item) => ({
          ...item,
          media_type: topRatedMediaType,
        })),
      );
    } catch (e) {
      setTopRatedError(e.message);
    } finally {
      setTopRatedLoading(false);
    }
  };

  const loadTrending = async () => {
    setTrendingLoading(true);
    setTrendingError(null);
    try {
      const data = await getTrending("all", "week");

      const filtered = (data.results || []).filter(
        (item) =>
          item.genres &&
          item.genres.some(
            (g) => g.name.toLowerCase() === genreName.toLowerCase(),
          ),
      );
      setTrendingData(
        filtered.length > 0 ? filtered : (data.results || []).slice(0, 12),
      );
    } catch (e) {
      setTrendingError(e.message);
    } finally {
      setTrendingLoading(false);
    }
  };

  useEffect(() => {
    loadPopular();
  }, [numericGenreId, tvGenreId, popularMediaType]);

  useEffect(() => {
    loadTopRated();
  }, [numericGenreId, tvGenreId, topRatedMediaType]);

  useEffect(() => {
    loadTrending();
  }, [genreName]);

  const emoji = GENRE_EMOJIS[genreName] || "🎬";

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="bg-gradient-to-b from-[#18181B]/80 to-transparent border-b border-white/5 mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <Link
            to="/genres"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Genres
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-600/30 flex items-center justify-center">
              <span className="text-3xl">{emoji}</span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white">
                {genreName}
              </h1>
              <p className="text-zinc-400 text-sm mt-1">
                Top picks across movies and TV shows
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Section
          title="Most Popular"
          icon={Flame}
          iconColor="text-red-500"
          items={popularData}
          loading={popularLoading}
          error={popularError}
          onRetry={loadPopular}
          mediaType={popularMediaType}
          onMediaTypeChange={setPopularMediaType}
        />

        <Section
          title="Top Rated"
          icon={Star}
          iconColor="text-amber-500"
          items={topRatedData}
          loading={topRatedLoading}
          error={topRatedError}
          onRetry={loadTopRated}
          mediaType={topRatedMediaType}
          onMediaTypeChange={setTopRatedMediaType}
        />

        <div className="mb-14">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            Trending This Week
          </h2>
          {trendingLoading ? (
            <SectionSkeleton count={12} />
          ) : (
            <MovieGrid
              items={trendingData}
              loading={false}
              error={trendingError}
              onRetry={loadTrending}
            />
          )}
        </div>
      </div>
    </div>
  );
};
