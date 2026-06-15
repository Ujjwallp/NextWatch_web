import { motion } from "framer-motion";
import { Film, Search, Bookmark, AlertCircle, CheckCircle } from "lucide-react";

const icons = {
  film: Film,
  search: Search,
  bookmark: Bookmark,
  error: AlertCircle,
  watched: CheckCircle,
};

export const EmptyState = ({
  icon = "film",
  title = "Nothing here yet",
  description = "",
  action = null,
}) => {
  const Icon = icons[icon] || Film;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5">
        <Icon className="w-9 h-9 text-zinc-500" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-zinc-400 max-w-sm text-sm leading-relaxed mb-6">
          {description}
        </p>
      )}
      {action}
    </motion.div>
  );
};

export const ErrorState = ({ message = "Something went wrong", onRetry }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 px-4 text-center"
  >
    <div className="w-20 h-20 rounded-full bg-red-600/10 border border-red-600/30 flex items-center justify-center mb-5">
      <AlertCircle className="w-9 h-9 text-red-500" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">Oops!</h3>
    <p className="text-zinc-400 max-w-sm text-sm mb-6">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm transition-colors"
      >
        Try Again
      </button>
    )}
  </motion.div>
);
