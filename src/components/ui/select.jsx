export function Select({ value, onValueChange, children }) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
      {children}
    </select>
  );
}

export function SelectTrigger({ children }) {
  return <div className="relative">{children}</div>;
}

export function SelectContent({ children }) {
  return <div className="absolute z-10">{children}</div>;
}

export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}

export function SelectValue() {
  return <span>Select a value</span>;
}