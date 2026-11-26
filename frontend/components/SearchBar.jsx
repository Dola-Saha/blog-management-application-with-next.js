import { Search } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search...",
  mobile = false
}) {
  return (
    <form
      onSubmit={onSubmit}
      className={mobile
        ? "absolute inset-x-3 bottom-3 block sm:hidden"
        : "relative mx-auto hidden w-full max-w-md sm:block"}
    >
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </form>
  );
}
