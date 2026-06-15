import { getImageUrl } from "@/services/tmdb";
import { User } from "lucide-react";

export const CastCard = ({ person }) => {
  const photoUrl = getImageUrl(person.profile_path, "w185");

  return (
    <div className="flex-shrink-0 w-24 text-center">
      <div className="w-24 h-24 rounded-xl overflow-hidden bg-zinc-800 mb-2 mx-auto border border-white/10">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={person.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-10 h-10 text-zinc-600" />
          </div>
        )}
      </div>
      <p className="text-white text-xs font-semibold line-clamp-2 leading-tight">
        {person.name}
      </p>
      <p className="text-zinc-500 text-[11px] line-clamp-1 mt-0.5">
        {person.character}
      </p>
    </div>
  );
};
