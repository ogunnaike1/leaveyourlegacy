export type Sort = 'featured' | 'price-asc' | 'price-desc' | 'name';

export default function SortSelect({ value, onChange }: { value: Sort; onChange: (v: Sort) => void }) {
  return (
    <label className="flex items-center gap-[10px] [font:500_12px/1_var(--font-sans)] tracking-[.12em] uppercase cursor-pointer">
      <span className="text-[#6B6761]">Sort</span>
      <select
        value={value} onChange={e => onChange(e.target.value as Sort)}
        className="appearance-none border-0 bg-transparent [font:500_12px/1_var(--font-sans)] tracking-[.08em] uppercase text-[#1C1B19] cursor-pointer py-[8px] px-0 outline-none"
      >
        <option value="featured">Featured</option>
        <option value="price-asc">Price, low to high</option>
        <option value="price-desc">Price, high to low</option>
        <option value="name">Name</option>
      </select>
    </label>
  );
}
