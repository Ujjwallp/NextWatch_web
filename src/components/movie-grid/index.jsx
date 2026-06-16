import { MovieCard } from "@/components/movie-card";
import { SectionSkeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";

export const MovieGrid = ({
  items = [],
  loading = false,
  error = null,
  onRetry,
  skeletonCount = 12,
  emptyTitle = "No results found",
  emptyDescription = "Try a different genre or search term.",
}) => {
  if (loading) return <SectionSkeleton count={skeletonCount} />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!items.length)
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon="film"
      />
    );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {items.map((item, idx) => (
        <MovieCard
          key={`${item.id}-${item.media_type || ""}`}
          item={item}
          index={idx}
        />
      ))}
    </div>
  );
};
