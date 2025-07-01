export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white shadow-sm rounded-lg p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={`border-b pb-3 mb-3 ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "" }) {
  return <div className={`space-y-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }) {
  return <h3 className={`text-xl font-semibold ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = "" }) {
  return <p className={`text-sm text-gray-600 ${className}`}>{children}</p>;
}
