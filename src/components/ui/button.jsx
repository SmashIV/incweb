export function Button({
  children,
  onClick,
  className = "",
  variant = "primary",
  size = "md",
  type = "button",
}) {
  const variants = {
    primary: "bg-black text-white hover:bg-gray-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    custom: "bg-white text-black hover:text-gray-500",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  return (
    <button
      onClick={onClick}
      type={type}
      className={`
        rounded-md focus:outline-none
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

