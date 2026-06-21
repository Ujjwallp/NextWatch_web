import { createContext, useContext, useState, useEffect } from "react";

const WatchlistContext = createContext(null);

const STORAGE_KEY = "nextwatch_watchlist";
const WATCHED_STORAGE_KEY = "nextwatch_watched";

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [watched, setWatched] = useState(() => {
    try {
      const stored = localStorage.getItem(WATCHED_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    } catch (e) {
      console.error("Failed to save watchlist:", e);
    }
  }, [watchlist]);

  useEffect(() => {
    try {
      localStorage.setItem(WATCHED_STORAGE_KEY, JSON.stringify(watched));
    } catch (e) {
      console.error("Failed to save watched list:", e);
    }
  }, [watched]);

  const addToWatchlist = (item) => {
    setWatchlist((prev) => {
      const exists = prev.find(
        (w) => w.id === item.id && w.media_type === item.media_type,
      );
      if (exists) return prev;
      return [
        {
          ...item,
          added_at: new Date().toISOString(),
        },
        ...prev,
      ];
    });
  };

  const removeFromWatchlist = (id, mediaType) => {
    setWatchlist((prev) =>
      prev.filter((w) => !(w.id === id && w.media_type === mediaType)),
    );
  };

  const isInWatchlist = (id, mediaType) => {
    return watchlist.some((w) => w.id === id && w.media_type === mediaType);
  };

  const toggleWatchlist = (item) => {
    if (isInWatchlist(item.id, item.media_type)) {
      removeFromWatchlist(item.id, item.media_type);
    } else {
      addToWatchlist(item);
    }
  };

  const stats = {
    total: watchlist.length,
    movies: watchlist.filter((w) => w.media_type === "movie").length,
    tv: watchlist.filter((w) => w.media_type === "tv").length,
  };

  const addToWatched = (item) => {
    setWatched((prev) => {
      const exists = prev.find(
        (w) => w.id === item.id && w.media_type === item.media_type,
      );
      if (exists) return prev;
      return [
        {
          ...item,
          watched_at: new Date().toISOString(),
        },
        ...prev,
      ];
    });
  };

  const removeFromWatched = (id, mediaType) => {
    setWatched((prev) =>
      prev.filter((w) => !(w.id === id && w.media_type === mediaType)),
    );
  };

  const clearWatched = () => {
    setWatched([]);
  };

  const isInWatched = (id, mediaType) => {
    return watched.some((w) => w.id === id && w.media_type === mediaType);
  };

  const toggleWatched = (item) => {
    if (isInWatched(item.id, item.media_type)) {
      removeFromWatched(item.id, item.media_type);
    } else {
      addToWatched(item);
    }
  };

  const markAsWatched = (item) => {
    setWatched((prev) => {
      const exists = prev.find(
        (w) => w.id === item.id && w.media_type === item.media_type,
      );
      if (exists) return prev;
      return [{ ...item, watched_at: new Date().toISOString() }, ...prev];
    });

    setWatchlist((prev) =>
      prev.filter(
        (w) => !(w.id === item.id && w.media_type === item.media_type),
      ),
    );
  };

  const watchedStats = {
    total: watched.length,
    movies: watched.filter((w) => w.media_type === "movie").length,
    tv: watched.filter((w) => w.media_type === "tv").length,
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        toggleWatchlist,
        stats,
        watched,
        addToWatched,
        removeFromWatched,
        clearWatched,
        isInWatched,
        toggleWatched,
        markAsWatched,
        watchedStats,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const ctx = useContext(WatchlistContext);
  if (!ctx)
    throw new Error("useWatchlist must be used within WatchlistProvider");
  return ctx;
};
