// Shop filter sidebar — Categories is the primary filter (prominent block at
// the top). Sizes / Colors / Fabrics / Sort By are secondary.
// The parent owns the filter state via the `filters` prop and `onChange`.

import { FILTER_SIZES, FILTER_COLORS, FILTER_FABRICS, FILTER_SORTS } from "./filterOptions";

const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="accent-stone-800 w-3.5 h-3.5 cursor-pointer rounded-sm"
    />
    <span className="text-[12px] tracking-[0.18em] text-stone-600 group-hover:text-stone-900 transition-colors">
      {label}
    </span>
  </label>
);

export default function FilterSidebar({
  categories,
  filters,
  onChange,
  categoryCounts,
}) {
  const set = (patch) => onChange({ ...filters, ...patch });
  const toggleArrayItem = (key, value) => {
    const current = filters[key] || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    set({ [key]: next });
  };

  return (
    <>
      <h2 className="font-serif text-2xl lg:text-[32px] text-gray-800 mb-6 lg:mb-8 border-b border-stone-200 pb-4 font-light">
        Filters
      </h2>

      {/* Categories — primary */}
      <div className="mb-10">
        <div className="flex justify-between items-baseline mb-4 mt-2">
          <h3 className="uppercase text-[11px] tracking-[0.25em] font-semibold text-gray-900">
            Shop By Category
          </h3>
          {filters.category !== "All" && (
            <button
              type="button"
              onClick={() => set({ category: "All" })}
              className="text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-500 hover:text-black underline underline-offset-4 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-col gap-1 border border-stone-200 bg-stone-50/50 p-1.5">
          {["All", ...categories].map((cat) => {
            const active = filters.category === cat;
            const count = categoryCounts[cat] ?? 0;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => set({ category: cat })}
                className={`w-full flex items-center justify-between text-left cursor-pointer px-3 py-2.5 text-[12px] tracking-[0.18em] uppercase transition-all duration-200 ${
                  active
                    ? "bg-stone-900 text-white shadow-sm"
                    : "text-stone-700 hover:bg-white hover:text-stone-900"
                }`}
              >
                <span className={active ? "font-semibold" : "font-medium"}>{cat}</span>
                <span className={`text-[10px] tabular-nums ${active ? "text-stone-300" : "text-stone-400"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sizes */}
      <div className="mb-8">
        <h3 className="uppercase text-[11px] tracking-[0.2em] font-medium text-gray-800 mb-4">Sizes</h3>
        <div className="grid grid-cols-3 gap-2">
          {FILTER_SIZES.map((s) => (
            <Toggle
              key={s}
              label={s}
              checked={(filters.sizes || []).includes(s)}
              onChange={() => toggleArrayItem("sizes", s)}
            />
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="mb-8 border-t border-gray-100 pt-6">
        <h3 className="uppercase text-[11px] tracking-[0.2em] font-medium text-gray-800 mb-4">Colors</h3>
        <div className="grid grid-cols-2 gap-y-2.5 gap-x-2">
          {FILTER_COLORS.map(({ name, bg }) => (
            <label key={name} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={(filters.colors || []).includes(name)}
                onChange={() => toggleArrayItem("colors", name)}
                className={`appearance-none w-4 h-4 rounded-full border border-stone-200 ${bg} cursor-pointer checked:ring-2 checked:ring-offset-2 checked:ring-stone-500`}
              />
              <span className="text-[12px] tracking-widest text-stone-500 capitalize">{name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Fabrics */}
      <div className="mb-8">
        <h3 className="uppercase text-[11px] tracking-[0.2em] font-medium text-gray-800 mb-4">Fabrics</h3>
        <div className="grid grid-cols-1 gap-y-2.5">
          {FILTER_FABRICS.map((f) => (
            <Toggle
              key={f}
              label={f}
              checked={(filters.fabrics || []).includes(f)}
              onChange={() => toggleArrayItem("fabrics", f)}
            />
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="border-t border-gray-100 pt-4">
        <h3 className="uppercase text-[11px] tracking-[0.2em] font-medium text-black mb-4">Sort By</h3>
        <div className="space-y-2.5">
          {FILTER_SORTS.map((s) => (
            <label key={s.id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="sort"
                checked={filters.sortBy === s.id}
                onChange={() => set({ sortBy: s.id })}
                className="w-4 h-4 accent-stone-800 cursor-pointer"
              />
              <span className="text-[12px] tracking-widest text-stone-500">{s.label}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
}