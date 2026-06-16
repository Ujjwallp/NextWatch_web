import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { searchContent, getImageUrl, getYear } from "@/services/tmdb";
import { useDebounce } from "@/hooks/use-debounce";

export const SearchBar = ({
  placeholder = "Search movies & TV shows...",
  autoFocus = false,
  large = false,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debouncedQuery = useDebounce(query, 400);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const search = async () => {
      setLoading(true);
      try {
        const data = await searchContent(debouncedQuery);
        const filtered = (data.results || [])
          .filter(
            (r) =>
              r.media_type !== "person" && (r.poster_path || r.backdrop_path),
          )
          .slice(0, 6);
        setResults(filtered);
        setShowDropdown(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [debouncedQuery]);


  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowDropdown(false);
      setQuery("");
    }
  };

  const handleResultClick = (item) => {
    const mediaType = item.media_type || (item.first_air_date ? "tv" : "movie");
    navigate(`/details/${mediaType}/${item.id}`);
    setShowDropdown(false);
    setQuery("");
  };

  const clearQuery = () => {
    setQuery("");
    setResults([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div
          className={`relative flex items-center ${large ? "text-base" : "text-sm"}`}
        >
          <Search
            className={`absolute left-4 text-zinc-400 ${large ? "w-5 h-5" : "w-4 h-4"}`}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className={`
              w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500
              focus:outline-none focus:border-red-600/50 focus:bg-white/8 transition-all
              ${large ? "pl-12 pr-12 py-4" : "pl-10 pr-10 py-3"}
            `}
          />
          <div className={`absolute right-4 flex items-center gap-2`}>
            {loading && (
              <Loader className="w-4 h-4 text-zinc-400 animate-spin" />
            )}
            {query && !loading && (
              <button type="button" onClick={clearQuery}>
                <X className="w-4 h-4 text-zinc-400 hover:text-white transition-colors" />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#18181B] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {results.map((item) => {
              const mediaType = item.media_type || "movie";
              const title = item.title || item.name;
              const year = getYear(item.release_date || item.first_air_date);
              const poster = getImageUrl(item.poster_path, "w92");

              return (
                <button
                  key={item.id}
                  onClick={() => handleResultClick(item)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left"
                >
                  <div className="w-10 h-14 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                    {poster ? (
                      <img
                        src={poster}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-800" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium line-clamp-1">
                      {title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          mediaType === "tv"
                            ? "bg-blue-600/50 text-blue-300"
                            : "bg-red-600/50 text-red-300"
                        }`}
                      >
                        {mediaType === "tv" ? "Series" : "Film"}
                      </span>
                      <span className="text-zinc-500 text-xs">{year}</span>
                    </div>
                  </div>
                </button>
              );
            })}

            <button
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-2 p-3 bg-white/3 hover:bg-white/8 border-t border-white/5 text-red-400 text-sm font-medium transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              See all results for "{query}"
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
