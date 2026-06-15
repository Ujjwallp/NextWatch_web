export const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-white/10 text-white/80",
    red: "bg-red-600/20 text-red-400 border border-red-600/30",
    amber: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    green: "bg-green-600/20 text-green-400 border border-green-600/30",
    blue: "bg-blue-600/20 text-blue-400 border border-blue-600/30",
    outline: "border border-white/20 text-white/70",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
