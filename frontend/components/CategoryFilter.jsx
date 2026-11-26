export default function CategoryFilter({ categories, activeCategory, onChange }) {
  return (
    <div className="mt-7 flex flex-wrap gap-2">
      {categories.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${activeCategory === item ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-700 hover:border-slate-400"}`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
