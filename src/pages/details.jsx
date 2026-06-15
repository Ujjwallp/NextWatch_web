import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Star,
  Clock,
  Calendar,
  Bookmark,
  BookmarkCheck,
  Play,
  X,
  ExternalLink,
  Tv,
  Film,
  Globe,
  Users,
  Check,
  CheckCircle,
} from "lucide-react";
import {
  getMovieDetails,
  getWatchProviders,
  getImageUrl,
  getBackdropUrl,
  getYear,
  formatRuntime,
  formatRating,
} from "@/services/tmdb";
import { StreamingProviders } from "@/components/movies/streaming-providers";
import { CastCard } from "@/components/movies/cast-card";
import { MovieCard } from "@/components/movies/movie-card";
import { DetailsSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { useWatchlist } from "@/contexts/watchlist-context";

const TrailerModal = ({ videoKey, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ backgroundColor: "rgba(0, 0, 0, 0.95)" }}
    onClick={onClose}
  >
    <div
      className="relative w-full max-w-4xl rounded-xl overflow-hidden bg-black shadow-2xl border border-white/10"
      style={{ aspectRatio: "16/9" }}
      onClick={(e) => e.stopPropagation()}
    >
      <iframe
        src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
        title="Trailer"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        className="w-full h-full border-0"
      />

      {/* Fallback link to open in new tab */}
      <a
        href={`https://www.youtube.com/watch?v=${videoKey}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-3 left-3 px-3 py-1.5 bg-black/80 rounded-lg flex items-center gap-1.5 text-white hover:bg-black text-xs font-semibold transition-colors z-10 border border-white/10 shadow-lg"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Open on YouTube
      </a>

      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-9 h-9 bg-black/80 rounded-full flex items-center justify-center text-white hover:bg-black transition-colors z-10"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  </motion.div>
);

const RECENTLY_VIEWED_KEY = "nextwatch_recently_viewed";
const RECENTLY_VIEWED_MAX = 20;

const saveToRecentlyViewed = (item) => {
  try {
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
    const existing = stored ? JSON.parse(stored) : [];
    const filtered = existing.filter(
      (r) => !(r.id === item.id && r.media_type === item.media_type),
    );
    const updated = [item, ...filtered].slice(0, RECENTLY_VIEWED_MAX);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
  } catch {

  }
};

export const Details = () => {
  const { mediaType, id } = useParams();
  const [details, setDetails] = useState(null);
  const [providers, setProviders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const {
    isInWatchlist,
    toggleWatchlist,
    isInWatched,
    toggleWatched,
    markAsWatched,
  } = useWatchlist();

  useEffect(() => {
    window.scrollTo(0, 0);
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [detailData, providerData] = await Promise.all([
          getMovieDetails(id, mediaType),
          getWatchProviders(id, mediaType),
        ]);
        setDetails(detailData);
        setProviders(providerData);


        saveToRecentlyViewed({
          id: detailData.id,
          media_type: mediaType,
          title: detailData.title || detailData.name,
          poster_path: detailData.poster_path,
          release_date: detailData.release_date || detailData.first_air_date,
          vote_average: detailData.vote_average,
        });


        const videos = detailData.videos?.results || [];
        const trailer =
          videos.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
          videos.find((v) => v.site === "YouTube");
        if (trailer) setTrailerKey(trailer.key);
      } catch (e) {
        setError(e.message || "Failed to load details");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, mediaType]);

  if (loading)
    return (
      <div className="pt-16">
        <DetailsSkeleton />
      </div>
    );

  if (error)
    return (
      <div className="pt-24 min-h-screen">
        <ErrorState message={error} />
      </div>
    );

  if (!details) return null;

  const title = details.title || details.name;
  const releaseDate = details.release_date || details.first_air_date;
  const year = getYear(releaseDate);
  const rating = formatRating(details.vote_average);
  const runtime = details.runtime
    ? formatRuntime(details.runtime)
    : details.episode_run_time?.[0]
      ? formatRuntime(details.episode_run_time[0])
      : null;
  const genres = details.genres || [];
  const cast = details.credits?.cast?.slice(0, 12) || [];
  const recommendations = [
    ...(details.recommendations?.results || []),
    ...(details.similar?.results || []),
  ]
    .filter((item, idx, arr) => arr.findIndex((i) => i.id === item.id) === idx)
    .slice(0, 12)
    .map((item) => ({ ...item, media_type: mediaType }));

  const backdropUrl = getBackdropUrl(details.backdrop_path);
  const posterUrl = getImageUrl(details.poster_path, "w500");
  const inWatchlist = isInWatchlist(details.id, mediaType);
  const inWatched = isInWatched(details.id, mediaType);

  const handleWatchlist = () => {
    toggleWatchlist({ ...details, media_type: mediaType });
  };

  const handleWatched = () => {
    if (inWatched) {
      toggleWatched({ ...details, media_type: mediaType });
    } else {
      markAsWatched({ ...details, media_type: mediaType });
    }
  };

  const ratingNum = parseFloat(rating);
  const ratingColor =
    ratingNum >= 8
      ? "text-green-400"
      : ratingNum >= 6.5
        ? "text-amber-400"
        : "text-red-400";

  return (
    <div className="min-h-screen">
      {/* Backdrop Hero */}
      <div className="relative h-[55vh] sm:h-[65vh] overflow-hidden">
        {backdropUrl ? (
          <>
            <img
              src={backdropUrl}
              alt={title}
              className="w-full h-full object-cover"
              onLoad={() => setImgLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/50 to-[#09090B]/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#09090B]/60 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-zinc-900" />
        )}

        {/* Back button */}
        <div className="absolute top-20 left-4 sm:left-6">
          <Link
            to={-1}
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
            className="flex items-center gap-2 bg-black/60 backdrop-blur-sm border border-white/10 text-white px-3 py-2 rounded-lg text-sm hover:bg-black/80 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-32 relative z-10 pb-20">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-shrink-0 mx-auto md:mx-0"
          >
            <div className="w-48 sm:w-56 md:w-64 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              {posterUrl ? (
                <img src={posterUrl} alt={title} className="w-full" />
              ) : (
                <div className="aspect-[2/3] bg-zinc-800 flex items-center justify-center">
                  {mediaType === "tv" ? (
                    <Tv className="w-16 h-16 text-zinc-600" />
                  ) : (
                    <Film className="w-16 h-16 text-zinc-600" />
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 min-w-0"
          >
            {/* Media Type */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-md uppercase ${
                  mediaType === "tv"
                    ? "bg-blue-600/30 text-blue-300"
                    : "bg-red-600/30 text-red-300"
                }`}
              >
                {mediaType === "tv" ? "TV Series" : "Movie"}
              </span>
              {details.status && (
                <span className="text-xs text-zinc-500 border border-zinc-700 rounded-md px-2 py-0.5">
                  {details.status}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 leading-tight">
              {title}
            </h1>

            {/* Tagline */}
            {details.tagline && (
              <p className="text-zinc-400 italic text-base mb-4">
                "{details.tagline}"
              </p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 mb-5 text-sm">
              {rating !== "N/A" && ratingNum > 0 && (
                <div
                  className={`flex items-center gap-1.5 font-semibold ${ratingColor}`}
                >
                  <Star className="w-4 h-4 fill-current" />
                  <span>{rating}</span>
                  <span className="text-zinc-500 font-normal text-xs">
                    / 10
                  </span>
                </div>
              )}
              {year && (
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Calendar className="w-4 h-4" />
                  {year}
                </div>
              )}
              {runtime && (
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Clock className="w-4 h-4" />
                  {runtime}
                </div>
              )}
              {details.number_of_seasons && (
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Tv className="w-4 h-4" />
                  {details.number_of_seasons} Season
                  {details.number_of_seasons !== 1 ? "s" : ""}
                </div>
              )}
              {details.vote_count > 0 && (
                <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                  <Users className="w-3.5 h-3.5" />
                  {details.vote_count.toLocaleString()} votes
                </div>
              )}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {genres.map((g) => (
                  <Badge key={g.id} variant="outline">
                    {g.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Overview */}
            <p className="text-zinc-300 text-base leading-relaxed mb-8 max-w-2xl">
              {details.overview || "No overview available."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {trailerKey && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-red-600/25"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Watch Trailer
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleWatchlist}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
                  inWatchlist
                    ? "bg-amber-500/20 border border-amber-500/40 text-amber-400"
                    : "bg-white/10 border border-white/10 text-white hover:bg-white/20"
                }`}
              >
                {inWatchlist ? (
                  <>
                    <BookmarkCheck className="w-4 h-4" />
                    In Watchlist
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    Add to Watchlist
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleWatched}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
                  inWatched
                    ? "bg-green-500/20 border border-green-500/40 text-green-400"
                    : "bg-white/10 border border-white/10 text-white hover:bg-white/20"
                }`}
              >
                {inWatched ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Watched
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Mark as Watched
                  </>
                )}
              </motion.button>

              {details.homepage && (
                <a
                  href={details.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 font-semibold transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  Official Site
                </a>
              )}
            </div>

            {/* Additional info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/5">
              {details.original_language && (
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">
                    Language
                  </p>
                  <p className="text-white text-sm font-medium uppercase">
                    {details.original_language}
                  </p>
                </div>
              )}
              {details.budget > 0 && (
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">
                    Budget
                  </p>
                  <p className="text-white text-sm font-medium">
                    ${(details.budget / 1000000).toFixed(0)}M
                  </p>
                </div>
              )}
              {details.revenue > 0 && (
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">
                    Revenue
                  </p>
                  <p className="text-white text-sm font-medium">
                    ${(details.revenue / 1000000).toFixed(0)}M
                  </p>
                </div>
              )}
              {details.networks && details.networks.length > 0 && (
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">
                    Network
                  </p>
                  <p className="text-white text-sm font-medium">
                    {details.networks[0].name}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Streaming Providers */}
        {providers && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 glass-card rounded-2xl p-6"
          >
            <StreamingProviders providers={providers} />
            {providers.results && (
              <p className="text-zinc-600 text-xs mt-4">
                Streaming availability may vary by region.{" "}
                <a
                  href={`https://www.themoviedb.org/${mediaType}/${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-zinc-400"
                >
                  View on TMDB <ExternalLink className="w-3 h-3 inline" />
                </a>
              </p>
            )}
          </motion.div>
        )}

        {/* Cast */}
        {cast.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10"
          >
            <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-2">
              <Users className="w-6 h-6 text-zinc-400" />
              Cast
            </h2>
            <div
              className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#3F3F46 transparent",
              }}
            >
              {cast.map((person) => (
                <CastCard key={person.id} person={person} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recommendations.map((item, idx) => (
                <MovieCard key={item.id} item={item} index={idx} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Trailer Modal */}
      <AnimatePresence>
        {showTrailer && trailerKey && (
          <TrailerModal
            videoKey={trailerKey}
            onClose={() => setShowTrailer(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
