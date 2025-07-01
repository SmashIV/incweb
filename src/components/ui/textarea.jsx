export function Textarea({ value, onChange, placeholder, className = "" }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full h-40 border border-gray-300 rounded-md px-4 py-2 text-sm text-left focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none ${className}`}
    />
  );
}
