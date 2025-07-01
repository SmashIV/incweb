export function Switch({ checked, onCheckedChange }) {
  return (
    <label className="inline-flex items-center cursor-pointer ">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onCheckedChange(!checked)}
        className="hidden"
      />
      <div
        className={`w-10 h-5 bg-black rounded-full p-1 transition-all ${checked ? "bg-gray-500" : ""}`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full transition-all ${checked ? "transform translate-x-5" : ""}`}
        />
      </div>
    </label>
  );
}
