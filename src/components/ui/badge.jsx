export function Badge({ children, variant = "default", className = "" }) {

  return (
    <span className={`px-3 py-1 text-sm font-medium rounded-full ${className}`}>
      {children}
    </span>
  );
}