export type Cat = { key: string; label: string; count: number; active: boolean };

export default function CategoryTabs({ cats, onPick }: { cats: Cat[]; onPick: (key: string) => void }) {
  return (
    <nav className="no-scrollbar flex gap-[clamp(20px,3vw,44px)] mt-[clamp(48px,6vw,88px)] overflow-x-auto [border-bottom:1px_solid_rgba(28,27,25,.14)]">
      {cats.map(c => (
        <button
          key={c.key} onClick={() => onPick(c.key)}
          className="appearance-none [background:none] border-0 p-[0_0_18px] relative cursor-pointer flex items-start gap-[6px] [font:500_15px/1_var(--font-sans)] whitespace-nowrap [transition:color_.3s]"
          style={{ color: c.active ? '#1C1B19' : '#6B6761' }}
        >
          {c.label}<span className="[font:400_10px/1_var(--font-mono)] text-[#8A857D]">{c.count}</span>
          <span className="absolute left-0 right-0 bottom-[-1px] h-px bg-[#1C1B19] origin-left [transition:transform_.55s_cubic-bezier(.2,.7,.2,1)]" style={{ transform: `scaleX(${c.active ? 1 : 0})` }} />
        </button>
      ))}
    </nav>
  );
}
