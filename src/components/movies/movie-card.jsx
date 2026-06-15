import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Bookmark, BookmarkCheck, Play, Tv } from "lucide-react";
import { getImageUrl, getYear } from "@/services/tmdb";
import { useWatchlist } from "@/contexts/watchlist-context";

export const MovieCard = ({ item, index = 0 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const mediaType = item.media_type || (item.first_air_date ? "tv" : "movie");
  const title = item.title || item.name;
  const releaseDate = item.release_date || item.first_air_date;
  const year = getYear(releaseDate);
  const rating = item.vote_average;
  const posterUrl = getImageUrl(item.poster_path, "w342");
  const inWatchlist = isInWatchlist(item.id, mediaType);

  const handleWatchlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist({ ...item, media_type: mediaType });
  };

  const ratingColor =
    rating >= 8
      ? "text-green-400"
      : rating >= 6.5
        ? "text-amber-400"
        : "text-red-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative"
    >
      <Link to={`/details/${mediaType}/${item.id}`} className="block">
        <div className="card-shine relative rounded-xl overflow-hidden bg-[#18181B] border border-white/5 transition-all duration-300 group-hover:border-white/20 group-hover:shadow-2xl group-hover:shadow-black/50 group-hover:-translate-y-1">
          {/* Poster */}
          <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900">
            {!imageError && posterUrl ? (
              <>
                {!imageLoaded && <div className="skeleton absolute inset-0" />}
                <img
                  src={posterUrl}
                  alt={title}
                  loading="lazy"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-700">
                {mediaType === "tv" ? (
                  <Tv className="w-12 h-12 mb-2" />
                ) : (
                  <Play className="w-12 h-12 mb-2" />
                )}
                <span className="text-xs text-center px-2 line-clamp-2">
                  {title}
                </span>
              </div>
            )}

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
              <div className="w-full">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-medium mb-1">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{rating ? rating.toFixed(1) : "N/A"}</span>
                </div>
                <p className="text-white/70 text-xs line-clamp-2 leading-relaxed">
                  {item.overview || "No overview available."}
                </p>
              </div>
            </div>

            {/* Media type badge */}
            <div className="absolute top-2 left-2">
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide ${
                  mediaType === "tv"
                    ? "bg-blue-600/90 text-white"
                    : "bg-red-600/90 text-white"
                }`}
              >
                {mediaType === "tv" ? "Series" : "Film"}
              </span>
            </div>

            {/* Watchlist button */}
            <button
              onClick={handleWatchlistToggle}
              className={`absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${
                inWatchlist
                  ? "bg-red-600 text-white opacity-100"
                  : "bg-black/60 text-white opacity-0 group-hover:opacity-100"
              }`}
              title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            >
              {inWatchlist ? (
                <BookmarkCheck className="w-3.5 h-3.5" />
              ) : (
                <Bookmark className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Info */}
          <div className="p-3">
            <h3 className="text-white text-sm font-semibold line-clamp-1 mb-0.5">
              {title}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 text-xs">{year}</span>
              {rating > 0 && (
                <span
                  className={`text-xs font-medium ${ratingColor} flex items-center gap-0.5`}
                >
                  <Star className="w-2.5 h-2.5 fill-current" />
                  {rating.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
