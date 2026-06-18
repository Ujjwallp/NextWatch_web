import { useState } from "react";
import { AlertCircle, X, ExternalLink } from "lucide-react";

export const ApiKeyBanner = () => {
  const [dismissed, setDismissed] = useState(false);
  const hasToken = !!import.meta.env.VITE_TMDB_TOKEN;

  if (hasToken || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50">
      <div className="bg-amber-500/10 border border-amber-500/30 backdrop-blur-xl rounded-xl p-4 flex gap-3 shadow-2xl">
        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-amber-300 text-sm font-semibold mb-1">
            TMDB API Token Required
          </p>
          <p className="text-amber-400/70 text-xs leading-relaxed mb-2">
            Add your TMDB Bearer token as{" "}
            <code className="bg-amber-500/20 px-1 py-0.5 rounded text-amber-300">
              VITE_TMDB_TOKEN
            </code>{" "}
            in your{" "}
            <code className="bg-amber-500/20 px-1 py-0.5 rounded text-amber-300">
              .env
            </code>{" "}
            file to load real data.
          </p>
          <a
            href="https://www.themoviedb.org/settings/api"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium"
          >
            Get your free API token
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-400/50 hover:text-amber-400 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
