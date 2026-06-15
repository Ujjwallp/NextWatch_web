import { useState, useEffect } from "react";
import {
  Link,
  NavLink as RouterNavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bookmark,
  TrendingUp,
  Grid3X3,
  Menu,
  X,
  Film,
  CheckCircle2,
  Home,
} from "lucide-react";
import { useWatchlist } from "@/contexts/watchlist-context";


const NAV_THEME = {
  "/": {
    active: "text-white",
    border: "border-red-500/50",
    glow: "shadow-[0_0_10px_rgba(239,68,68,0.3)]",
    bg: "bg-red-500/10",
  },
  "/genres": {
    active: "text-white",
    border: "border-red-500/50",
    glow: "shadow-[0_0_10px_rgba(239,68,68,0.3)]",
    bg: "bg-red-500/10",
  },
  "/trending": {
    active: "text-white",
    border: "border-red-500/50",
    glow: "shadow-[0_0_10px_rgba(239,68,68,0.3)]",
    bg: "bg-red-500/10",
  },
  "/search": {
    active: "text-white",
    border: "border-red-500/50",
    glow: "shadow-[0_0_10px_rgba(239,68,68,0.3)]",
    bg: "bg-red-500/10",
  },
  "/watchlist": {
    active: "text-amber-300",
    border: "border-amber-400/50",
    glow: "shadow-[0_0_10px_rgba(251,191,36,0.3)]",
    bg: "bg-amber-400/10",
  },
  "/watched": {
    active: "text-green-300",
    border: "border-green-400/50",
    glow: "shadow-[0_0_10px_rgba(74,222,128,0.3)]",
    bg: "bg-green-400/10",
  },
};

const NavItem = ({ to, children, icon: Icon, onClick, exact = false }) => {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : location.pathname === to;
  const theme = NAV_THEME[to] || NAV_THEME["/"];

  return (
    <RouterNavLink
      to={to}
      end={exact}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
        isActive
          ? `${theme.active} ${theme.bg} ${theme.border} ${theme.glow}`
          : "text-zinc-400 border-transparent hover:text-white hover:bg-white/5"
      }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </RouterNavLink>
  );
};

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { stats, watchedStats } = useWatchlist();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };


  const watchlistActive = location.pathname === "/watchlist";
  const watchedActive = location.pathname === "/watched";

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || mobileOpen
            ? "bg-[#09090B]/95 backdrop-blur-xl border-b border-white/5 shadow-xl"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Next<span className="text-red-500">Watch</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              <NavItem to="/" icon={Home} exact>
                Home
              </NavItem>
              <NavItem to="/genres" icon={Grid3X3}>
                Genres
              </NavItem>
              <NavItem to="/trending" icon={TrendingUp}>
                Trending
              </NavItem>
              <NavItem to="/search" icon={Search}>
                Search
              </NavItem>
            </div>

            {/* Desktop Search + Watchlist */}
            <div className="hidden md:flex items-center gap-3">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Quick search..."
                  className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600/50 focus:bg-white/10 w-44 transition-all focus:w-56"
                />
              </form>

              <Link
                to="/watchlist"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  watchlistActive
                    ? "text-amber-300 bg-amber-400/10 border-amber-400/50 shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                    : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>Watchlist</span>
                {stats.total > 0 && (
                  <span className="bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {stats.total > 99 ? "99+" : stats.total}
                  </span>
                )}
              </Link>

              <Link
                to="/watched"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  watchedActive
                    ? "text-green-300 bg-green-400/10 border-green-400/50 shadow-[0_0_10px_rgba(74,222,128,0.3)]"
                    : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Watched</span>
                {watchedStats.total > 0 && (
                  <span className="bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {watchedStats.total > 99 ? "99+" : watchedStats.total}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile controls */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                to="/watchlist"
                className={`relative flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200 ${
                  watchlistActive
                    ? "bg-amber-400/10 border-amber-400/50 text-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.3)]"
                    : "bg-white/5 border-white/10 text-white"
                }`}
              >
                <Bookmark className="w-4 h-4" />
                {stats.total > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px]">
                    {stats.total > 9 ? "9+" : stats.total}
                  </span>
                )}
              </Link>
              <Link
                to="/watched"
                className={`relative flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200 ${
                  watchedActive
                    ? "bg-green-400/10 border-green-400/50 text-green-300 shadow-[0_0_8px_rgba(74,222,128,0.3)]"
                    : "bg-white/5 border-white/10 text-white"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {watchedStats.total > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px]">
                    {watchedStats.total > 9 ? "9+" : watchedStats.total}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white"
              >
                {mobileOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 bg-[#09090B]/95 backdrop-blur-xl"
            >
              <div className="px-4 py-4 space-y-2">
                <form onSubmit={handleSearch} className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search movies & shows..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600/50"
                  />
                </form>
                <NavItem
                  to="/"
                  icon={Home}
                  exact
                  onClick={() => setMobileOpen(false)}
                >
                  Home
                </NavItem>
                <NavItem
                  to="/genres"
                  icon={Grid3X3}
                  onClick={() => setMobileOpen(false)}
                >
                  Genres
                </NavItem>
                <NavItem
                  to="/trending"
                  icon={TrendingUp}
                  onClick={() => setMobileOpen(false)}
                >
                  Trending
                </NavItem>
                <NavItem
                  to="/search"
                  icon={Search}
                  onClick={() => setMobileOpen(false)}
                >
                  Search
                </NavItem>
                <NavItem
                  to="/watchlist"
                  icon={Bookmark}
                  onClick={() => setMobileOpen(false)}
                >
                  Watchlist
                </NavItem>
                <NavItem
                  to="/watched"
                  icon={CheckCircle2}
                  onClick={() => setMobileOpen(false)}
                >
                  Watched
                </NavItem>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};
