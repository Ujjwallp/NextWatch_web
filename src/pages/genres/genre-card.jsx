import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const GENRE_CONFIG = {
  Action: {
    gradient: "from-red-600/80 via-orange-600/60 to-red-900/80",
    border: "border-red-500/30",
    glow: "group-hover:shadow-red-600/30",
    emoji: "💥",
    bg: "bg-gradient-to-br from-red-900/40 to-orange-900/30",
  },
  Thriller: {
    gradient: "from-gray-800/90 via-slate-700/70 to-gray-900/90",
    border: "border-slate-500/30",
    glow: "group-hover:shadow-slate-500/30",
    emoji: "🔪",
    bg: "bg-gradient-to-br from-slate-900/40 to-gray-900/40",
  },
  Crime: {
    gradient: "from-zinc-800/90 via-stone-700/70 to-zinc-900/90",
    border: "border-zinc-500/30",
    glow: "group-hover:shadow-zinc-500/30",
    emoji: "🕵️",
    bg: "bg-gradient-to-br from-zinc-900/40 to-stone-900/40",
  },
  Mystery: {
    gradient: "from-violet-900/80 via-purple-800/60 to-violet-950/80",
    border: "border-violet-500/30",
    glow: "group-hover:shadow-violet-600/30",
    emoji: "🔮",
    bg: "bg-gradient-to-br from-violet-900/40 to-purple-900/30",
  },
  "Sci-Fi": {
    gradient: "from-cyan-900/80 via-blue-800/60 to-cyan-950/80",
    border: "border-cyan-500/30",
    glow: "group-hover:shadow-cyan-600/30",
    emoji: "🚀",
    bg: "bg-gradient-to-br from-cyan-900/40 to-blue-900/30",
  },
  Documentary: {
    gradient: "from-amber-900/80 via-yellow-800/60 to-amber-950/80",
    border: "border-amber-500/30",
    glow: "group-hover:shadow-amber-600/30",
    emoji: "🎬",
    bg: "bg-gradient-to-br from-amber-900/40 to-yellow-900/30",
  },
  History: {
    gradient: "from-stone-800/90 via-amber-900/60 to-stone-900/90",
    border: "border-stone-500/30",
    glow: "group-hover:shadow-stone-500/30",
    emoji: "🏛️",
    bg: "bg-gradient-to-br from-stone-900/40 to-amber-900/20",
  },
  Biography: {
    gradient: "from-teal-900/80 via-emerald-800/60 to-teal-950/80",
    border: "border-teal-500/30",
    glow: "group-hover:shadow-teal-600/30",
    emoji: "📖",
    bg: "bg-gradient-to-br from-teal-900/40 to-emerald-900/30",
  },
  Adventure: {
    gradient: "from-green-800/80 via-emerald-700/60 to-green-900/80",
    border: "border-green-500/30",
    glow: "group-hover:shadow-green-600/30",
    emoji: "🗺️",
    bg: "bg-gradient-to-br from-green-900/40 to-emerald-900/30",
  },
  Horror: {
    gradient: "from-red-950/90 via-rose-900/70 to-black/90",
    border: "border-red-900/50",
    glow: "group-hover:shadow-red-900/50",
    emoji: "👻",
    bg: "bg-gradient-to-br from-red-950/40 to-rose-950/30",
  },
  Comedy: {
    gradient: "from-yellow-700/80 via-amber-600/60 to-yellow-800/80",
    border: "border-yellow-500/30",
    glow: "group-hover:shadow-yellow-500/30",
    emoji: "😄",
    bg: "bg-gradient-to-br from-yellow-900/40 to-amber-900/30",
  },
  Drama: {
    gradient: "from-blue-900/80 via-indigo-800/60 to-blue-950/80",
    border: "border-blue-500/30",
    glow: "group-hover:shadow-blue-600/30",
    emoji: "🎭",
    bg: "bg-gradient-to-br from-blue-900/40 to-indigo-900/30",
  },
};

const GENRE_DESCRIPTIONS = {
  Action: "High-octane thrills & explosive sequences",
  Thriller: "Edge-of-your-seat suspense & tension",
  Crime: "Gritty stories of law, order & chaos",
  Mystery: "Puzzles, secrets & hidden truths",
  "Sci-Fi": "Future worlds & scientific imagination",
  Documentary: "Real stories that shape our world",
  History: "Epic tales from our past",
  Biography: "Remarkable lives & inspiring journeys",
  Adventure: "Epic quests & daring expeditions",
  Horror: "Fear, dread & the supernatural",
  Comedy: "Laughter, joy & feel-good moments",
  Drama: "Powerful emotions & human stories",
};

export const GenreCard = ({ genre, index = 0 }) => {
  const config = GENRE_CONFIG[genre.name] || {
    gradient: "from-zinc-700/80 to-zinc-900/80",
    border: "border-zinc-600/30",
    glow: "group-hover:shadow-zinc-500/30",
    emoji: "🎬",
    bg: "bg-gradient-to-br from-zinc-900/40 to-zinc-800/30",
  };

  const description =
    GENRE_DESCRIPTIONS[genre.name] || "Explore amazing content";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="group"
    >
      <Link
        to={`/recommendations/${genre.id}?name=${encodeURIComponent(genre.name)}`}
        className="block"
      >
        <div
          className={`
            relative overflow-hidden rounded-2xl border ${config.border}
            ${config.bg}
            transition-all duration-500
            group-hover:scale-[1.03] group-hover:shadow-xl ${config.glow}
            group-hover:border-opacity-60
            cursor-pointer
          `}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-70 group-hover:opacity-90 transition-opacity duration-300`}
          />

          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10 p-6 min-h-[160px] flex flex-col justify-between">
            <div>
              <span className="text-4xl mb-3 block">{config.emoji}</span>
              <h3 className="text-white font-bold text-xl mb-1 group-hover:text-white transition-colors">
                {genre.name}
              </h3>
              <p className="text-white/50 text-xs group-hover:text-white/70 transition-colors leading-relaxed">
                {description}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-white/40 text-xs font-medium uppercase tracking-wider">
                Explore
              </span>
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <svg
                  className="w-3 h-3 text-white group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",
            }}
          />
        </div>
      </Link>
    </motion.div>
  );
};
