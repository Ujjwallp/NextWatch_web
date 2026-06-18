import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search as SearchIcon, Film, Tv, Grid } from "lucide-react";
import { searchContent, searchMovies, searchTV } from "@/services/tmdb";
import { MovieGrid } from "@/components/movie-grid";
import { SearchBar } from "@/components/search-bar";
import { useDebounce } from "@/hooks/use-debounce";

const FILTER_OPTIONS = [
  { value: "multi", label: "All", icon: Grid },
  { value: "movie", label: "Movies", icon: Film },
  { value: "tv", label: "TV Shows", icon: Tv },
];

export const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState("multi");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    setPage(1);
    setResults([]);
  }, [debouncedQuery, filter]);

  useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
      setResults([]);
      setTotalResults(0);
      setLoading(false);
      return;
    }

    const doSearch = async () => {
      setLoading(true);
      setError(null);
      try {
        let searchResults;
        if (filter === "movie") {
          searchResults = await searchMovies(debouncedQuery, page);
          searchResults.results = (searchResults.results || []).map((r) => ({
            ...r,
            media_type: "movie",
          }));
        } else if (filter === "tv") {
          searchResults = await searchTV(debouncedQuery, page);
          searchResults.results = (searchResults.results || []).map((r) => ({
            ...r,
            media_type: "tv",
          }));
        } else {
          searchResults = await searchContent(debouncedQuery, page);
          searchResults.results = (searchResults.results || []).filter(
            (r) => r.media_type !== "person",
          );
        }

        if (page === 1) {
          setResults(searchResults.results || []);
        } else {
          setResults((prev) => [...prev, ...(searchResults.results || [])]);
        }
        setTotalResults(searchResults.total_results || 0);
        setTotalPages(searchResults.total_pages || 0);


        setSearchParams({ q: debouncedQuery });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    doSearch();
  }, [debouncedQuery, filter, page]);

  const loadMore = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-1.5 mb-5">
            <SearchIcon className="w-4 h-4 text-zinc-400" />
            <span className="text-zinc-300 text-sm font-medium">Search</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Find Your <span className="text-gradient">Next Watch</span>
          </h1>
          <p className="text-zinc-400 text-lg mb-8">
            Search across thousands of movies and TV shows.
          </p>

          <div className="max-w-2xl">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 z-10" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search movies & TV shows..."
                autoFocus
                className="w-full bg-[#18181B] border border-white/10 rounded-xl pl-12 pr-5 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-red-600/50 text-base transition-colors"
              />
            </div>
          </div>
        </motion.div>

        <div className="flex gap-2 mb-6">
          {FILTER_OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => {
                setFilter(value);
                setPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filter === value
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                  : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {query && !loading && totalResults > 0 && (
          <p className="text-zinc-500 text-sm mb-6">
            Found{" "}
            <span className="text-white font-medium">
              {totalResults.toLocaleString()}
            </span>{" "}
            results for "<span className="text-white">{query}</span>"
          </p>
        )}

        {!query && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5">
              <SearchIcon className="w-9 h-9 text-zinc-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Start Searching
            </h3>
            <p className="text-zinc-400 text-sm max-w-sm">
              Type a movie or TV show title above to get started.
            </p>
          </div>
        )}

        {query && (
          <MovieGrid
            items={results}
            loading={loading && page === 1}
            error={error}
            emptyTitle="No results found"
            emptyDescription={`We couldn't find anything for "${query}". Try a different search term.`}
          />
        )}

        {!loading && page < totalPages && results.length > 0 && (
          <div className="flex justify-center mt-10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={loadMore}
              className="flex items-center gap-2 bg-white/10 border border-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-medium transition-all"
            >
              Load More Results
            </motion.button>
          </div>
        )}

        {loading && page > 1 && (
          <div className="flex justify-center mt-10">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};
