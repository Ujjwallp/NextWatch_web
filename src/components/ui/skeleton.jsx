const Skeleton = ({ className = "" }) => (
  <div className={`skeleton ${className}`} />
);

const MovieCardSkeleton = () => (
  <div className="rounded-xl overflow-hidden bg-[#18181B] border border-white/5">
    <Skeleton className="aspect-[2/3] w-full" />
    <div className="p-3 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-5 w-12 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  </div>
);

export const DetailsSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="w-full h-[50vh]" />
    <div className="max-w-7xl mx-auto px-4 space-y-4">
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-3">
        <Skeleton className="h-10 w-32 rounded-full" />
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
    </div>
  </div>
);

export const SectionSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <MovieCardSkeleton key={i} />
    ))}
  </div>
);
