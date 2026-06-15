import { motion } from "framer-motion";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  onClick,
  type = "button",
  ...props
}) => {
  const variants = {
    primary:
      "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/25",
    secondary:
      "bg-white/10 hover:bg-white/20 text-white border border-white/10",
    outline:
      "border border-white/20 hover:border-white/40 text-white hover:bg-white/5",
    ghost: "hover:bg-white/10 text-white/70 hover:text-white",
    amber:
      "bg-amber-500 hover:bg-amber-400 text-black font-semibold shadow-lg shadow-amber-500/25",
    danger:
      "bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-600/30",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg",
    icon: "p-2",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-all duration-200 cursor-pointer select-none
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
};
