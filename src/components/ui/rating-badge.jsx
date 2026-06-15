import { Star } from "lucide-react";

export const RatingBadge = ({ rating, size = "sm" }) => {
  if (!rating || rating === 0) return null;
  const formatted = typeof rating === "number" ? rating.toFixed(1) : rating;
  const color =
    rating >= 8
      ? "text-green-400 border-green-500/30 bg-green-500/10"
      : rating >= 6.5
        ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
        : "text-red-400 border-red-500/30 bg-red-500/10";

  const sizeClass =
    size === "lg" ? "text-sm px-2.5 py-1 gap-1.5" : "text-xs px-2 py-0.5 gap-1";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold ${color} ${sizeClass}`}
    >
      <Star
        className={size === "lg" ? "w-3.5 h-3.5" : "w-3 h-3"}
        fill="currentColor"
      />
      {formatted}
    </span>
  );
};
