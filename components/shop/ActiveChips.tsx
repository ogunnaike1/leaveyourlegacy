export type Chip = { label: string; remove: () => void };

export default function ActiveChips({ chips, onClear }: { chips: Chip[]; onClear: () => void }) {
  if (!chips.length) return null;
  return (
    <div className="flex flex-wrap gap-[8px] p-[16px_0_0]">
      {chips.map(ch => (
        <button
          key={ch.label} onClick={ch.remove}
          className="appearance-none [border:1px_solid_rgba(28,27,25,.2)] bg-transparent h-[34px] p-[0_14px] flex items-center gap-[10px] [font:400_13px/1_var(--font-sans)] text-[#1C1B19] cursor-pointer [transition:border-color_.3s] hover:border-[#1C1B19]"
        >{ch.label} <span className="text-[14px] text-[#6B6761]">×</span></button>
      ))}
      <button onClick={onClear} className="appearance-none border-0 [background:none] h-[34px] p-[0_6px] [font:400_13px/1_var(--font-sans)] text-[#6B6761] underline underline-offset-4 cursor-pointer">Clear all</button>
    </div>
  );
}
