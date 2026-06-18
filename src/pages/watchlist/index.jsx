import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  Search,
  Film,
  Tv,
  Trash2,
  Star,
  Calendar,
  BarChart3,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { useWatchlist } from "@/context/watchlist-context";
import { getImageUrl, getYear } from "@/services/tmdb";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";



const Toast = ({ message, visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-green-600 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-xl shadow-green-900/40 pointer-events-none"
      >
        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
        {message}
      </motion.div>
    )}
  </AnimatePresence>
);



const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="glass-card rounded-xl p-5 flex items-center gap-4"
  >
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
    >
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-zinc-400 text-sm">{label}</p>
    </div>
  </motion.div>
);



const WatchlistItemCard = ({
  item,
  onRemove,
  onMarkWatched,
  alreadyWatched,
}) => {
  const title = item.title || item.name;
  const mediaType = item.media_type || "movie";
  const year = getYear(item.release_date || item.first_air_date);
  const rating = item.vote_average;
  const poster = getImageUrl(item.poster_path, "w342");
  const addedDate = item.added_at
    ? new Date(item.added_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const ratingColor =
    rating >= 8
      ? "text-green-400"
      : rating >= 6.5
        ? "text-amber-400"
        : "text-red-400";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass-card glass-card-hover rounded-xl overflow-hidden group"
    >
      <Link to={`/details/${mediaType}/${item.id}`} className="flex gap-4 p-4">
        <div className="flex-shrink-0 w-16 h-24 rounded-lg overflow-hidden bg-zinc-800 border border-white/5">
          {poster ? (
            <img
              src={poster}
              alt={title}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {mediaType === "tv" ? (
                <Tv className="w-6 h-6 text-zinc-600" />
              ) : (
                <Film className="w-6 h-6 text-zinc-600" />
              )}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-white font-semibold text-sm line-clamp-2 leading-snug">
              {title}
            </h3>
            <span
              className={`flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                mediaType === "tv"
                  ? "bg-blue-600/30 text-blue-300"
                  : "bg-red-600/30 text-red-300"
              }`}
            >
              {mediaType === "tv" ? "Series" : "Film"}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-2">
            {rating > 0 && (
              <span
                className={`flex items-center gap-1 text-xs font-medium ${ratingColor}`}
              >
                <Star className="w-3 h-3 fill-current" />
                {rating.toFixed(1)}
              </span>
            )}
            {year && <span className="text-zinc-500 text-xs">{year}</span>}
          </div>

          <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed mb-2">
            {item.overview || "No overview available."}
          </p>

          {addedDate && (
            <div className="flex items-center gap-1.5 text-zinc-600 text-xs">
              <Calendar className="w-3 h-3" />
              Added {addedDate}
            </div>
          )}
        </div>
      </Link>

      <div className="px-4 pb-4 flex items-center justify-between gap-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            onMarkWatched(item);
          }}
          disabled={alreadyWatched}
          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all ${
            alreadyWatched
              ? "text-green-500/60 bg-green-600/10 cursor-default"
              : "text-green-400 hover:text-white hover:bg-green-600 border border-green-600/30 hover:border-green-600"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          {alreadyWatched ? "Already Watched" : "Mark as Watched"}
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            onRemove(item.id, mediaType);
          }}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-400 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-600/10"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Remove
        </button>
      </div>
    </motion.div>
  );
};



export const Watchlist = () => {
  const { watchlist, removeFromWatchlist, stats, markAsWatched, isInWatched } =
    useWatchlist();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }, []);

  const handleMarkWatched = useCallback(
    (item) => {
      markAsWatched(item);
      showToast("Moved to Watched ✓");
    },
    [markAsWatched, showToast],
  );


  let filtered = watchlist.filter((item) => {
    const title = (item.title || item.name || "").toLowerCase();
    const matchesSearch = title.includes(search.toLowerCase());
    const matchesType = filterType === "all" || item.media_type === filterType;
    return matchesSearch && matchesType;
  });


  filtered = [...filtered].sort((a, b) => {
    if (sortOrder === "newest")
      return new Date(b.added_at) - new Date(a.added_at);
    if (sortOrder === "oldest")
      return new Date(a.added_at) - new Date(b.added_at);
    if (sortOrder === "rating")
      return (b.vote_average || 0) - (a.vote_average || 0);
    if (sortOrder === "title") {
      const ta = (a.title || a.name || "").toLowerCase();
      const tb = (b.title || b.name || "").toLowerCase();
      return ta.localeCompare(tb);
    }
    return 0;
  });

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-1.5 mb-5">
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">
              My Watchlist
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Saved for <span className="text-gradient">Later</span>
          </h1>
          <p className="text-zinc-400 text-lg">
            Your personal collection of movies and shows to watch.
          </p>
        </motion.div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={BarChart3}
            label="Total Saved"
            value={stats.total}
            color="bg-red-600/20 text-red-400"
          />
          <StatCard
            icon={Film}
            label="Movies"
            value={stats.movies}
            color="bg-amber-500/20 text-amber-400"
          />
          <StatCard
            icon={Tv}
            label="TV Shows"
            value={stats.tv}
            color="bg-blue-600/20 text-blue-400"
          />
        </div>

        {watchlist.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your watchlist..."
                className="w-full bg-[#18181B] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600/50"
              />
            </div>

            <div className="flex gap-2">
              {[
                { value: "all", label: "All", icon: Filter },
                { value: "movie", label: "Movies", icon: Film },
                { value: "tv", label: "TV", icon: Tv },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setFilterType(value)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    filterType === value
                      ? "bg-red-600 text-white"
                      : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-[#18181B] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-red-600/50 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rating">Highest Rated</option>
              <option value="title">A–Z</option>
            </select>
          </div>
        )}

        {watchlist.length > 0 && filtered.length !== watchlist.length && (
          <p className="text-zinc-500 text-sm mb-4">
            Showing {filtered.length} of {watchlist.length} items
          </p>
        )}

        {watchlist.length === 0 && (
          <EmptyState
            icon="bookmark"
            title="Your watchlist is empty"
            description="Browse genres, trending content, or search for specific movies and shows to add them here."
            action={
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/genres">
                  <Button variant="primary">Explore Genres</Button>
                </Link>
                <Link to="/trending">
                  <Button variant="secondary">Trending Movies</Button>
                </Link>
              </div>
            }
          />
        )}

        {watchlist.length > 0 && filtered.length === 0 && (
          <EmptyState
            icon="search"
            title="No matches found"
            description={`Nothing in your watchlist matches "${search}".`}
          />
        )}

        <AnimatePresence mode="popLayout">
          {filtered.length > 0 && (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {filtered.map((item) => (
                <WatchlistItemCard
                  key={`${item.id}-${item.media_type}`}
                  item={item}
                  onRemove={removeFromWatchlist}
                  onMarkWatched={handleMarkWatched}
                  alreadyWatched={isInWatched(
                    item.id,
                    item.media_type || "movie",
                  )}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {watchlist.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-10"
          >
            <button
              onClick={() => {
                if (
                  confirm(
                    "Are you sure you want to clear your entire watchlist?",
                  )
                ) {
                  watchlist.forEach((item) =>
                    removeFromWatchlist(item.id, item.media_type),
                  );
                }
              }}
              className="flex items-center gap-2 text-zinc-500 hover:text-red-400 text-sm transition-colors px-4 py-2 rounded-lg hover:bg-red-600/5"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </motion.div>
        )}
      </div>

      <Toast message={toastMessage} visible={toastVisible} />
    </div>
  );
};
