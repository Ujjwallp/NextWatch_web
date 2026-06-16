import { motion } from "framer-motion";
import { getImageUrl } from "@/services/tmdb";
import { Tv } from "lucide-react";

const PROVIDER_COLORS = {
  8: "from-red-600/20 to-red-900/20 border-red-600/30", // Netflix
  9: "from-blue-600/20 to-blue-900/20 border-blue-600/30", // Amazon
  337: "from-blue-500/20 to-blue-800/20 border-blue-500/30", // Disney+
  350: "from-gray-600/20 to-gray-900/20 border-gray-600/30", // Apple TV+
  15: "from-green-600/20 to-green-900/20 border-green-600/30", // Hulu
  1899: "from-purple-600/20 to-purple-900/20 border-purple-600/30", // Max
  2: "from-cyan-600/20 to-cyan-900/20 border-cyan-600/30", // Apple iTunes
  3: "from-orange-600/20 to-orange-900/20 border-orange-600/30", // Google Play
};

const ProviderCard = ({ provider, type }) => {
  const logoUrl = getImageUrl(provider.logo_path, "w92");
  const gradientClass =
    PROVIDER_COLORS[provider.provider_id] ||
    "from-zinc-700/20 to-zinc-900/20 border-zinc-700/30";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-br ${gradientClass} border backdrop-blur-sm cursor-default`}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={provider.provider_name}
          className="w-10 h-10 rounded-lg object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-zinc-700 flex items-center justify-center">
          <Tv className="w-5 h-5 text-zinc-400" />
        </div>
      )}
      <span className="text-white text-xs font-medium text-center leading-tight">
        {provider.provider_name}
      </span>
      {type && (
        <span className="text-[10px] text-zinc-400 capitalize">{type}</span>
      )}
    </motion.div>
  );
};

export const StreamingProviders = ({ providers, region = "US" }) => {
  if (!providers) return null;

  const regionData = providers.results?.[region];
  if (!regionData) {

    const availableRegions = Object.keys(providers.results || {});
    if (availableRegions.length === 0) return null;
  }

  const data =
    providers.results?.[region] || Object.values(providers.results || {})[0];
  if (!data) return null;

  const flatrate = data.flatrate || [];
  const rent = data.rent || [];
  const buy = data.buy || [];

  const allProviders = [
    ...flatrate.map((p) => ({ ...p, type: "streaming" })),
    ...rent.map((p) => ({ ...p, type: "rent" })),
    ...buy.map((p) => ({ ...p, type: "buy" })),
  ];


  const seen = new Set();
  const uniqueProviders = allProviders.filter((p) => {
    if (seen.has(p.provider_id)) return false;
    seen.add(p.provider_id);
    return true;
  });

  if (uniqueProviders.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Tv className="w-5 h-5 text-red-500" />
        Available On
      </h3>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {uniqueProviders.map((provider) => (
          <ProviderCard
            key={provider.provider_id}
            provider={provider}
            type={provider.type !== "streaming" ? provider.type : null}
          />
        ))}
      </div>

      {flatrate.length === 0 && (
        <p className="text-zinc-400 text-sm mt-3">
          Available to rent or purchase — not currently on a streaming plan.
        </p>
      )}
    </div>
  );
};
