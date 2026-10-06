export type FilterOption = { label: string; count: number; on: boolean; swatch?: string; toggle: () => void };
export type FilterGroup = { title: string; options: FilterOption[] };

type Props = { groups: FilterGroup[]; open: boolean; mobile: boolean; count: number; onClose: () => void; onClear: () => void };

/** Desktop: 240px sticky sidebar that slides out (margin-left −296px). Mobile (<900px): 86vh bottom sheet with scrim. */
export default function FilterPanel({ groups, open, mobile: m, count, onClose, onClear }: Props) {
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-[79] bg-[rgba(18,17,16,.4)] [transition:opacity_.5s_ease]" style={{ opacity: m && open ? 1 : 0, pointerEvents: m && open ? 'auto' : 'none' }} />
      <aside
        className="no-scrollbar flex-none overflow-auto bg-[#F7F5F1] box-border [transition:transform_.7s_cubic-bezier(.7,0,.2,1),opacity_.5s_ease,margin-left_.7s_cubic-bezier(.7,0,.2,1)]"
        style={{
          position: m ? 'fixed' : 'sticky', top: m ? 'auto' : '100px', left: m ? '0' : 'auto', right: m ? '0' : 'auto', bottom: m ? '0' : 'auto',
          zIndex: m ? 80 : 1, width: m ? 'auto' : '240px', height: m ? '86vh' : 'auto', maxHeight: m ? '86vh' : 'calc(100vh - 120px)',
          padding: m ? '20px 20px 0' : '0', transform: m ? (open ? 'translateY(0)' : 'translateY(102%)') : 'none',
          opacity: m ? 1 : (open ? 1 : 0), marginLeft: m ? '0' : (open ? '0' : '-296px'), pointerEvents: open ? 'auto' : 'none'
        }}
        aria-hidden={!open}
      >
        {m && (
          <div className="flex justify-between items-center pb-[16px] [border-bottom:1px_solid_rgba(28,27,25,.14)]">
            <span className="font-medium text-[16px]">Filter</span>
            <button onClick={onClose} className="appearance-none [background:none] border-0 [font:500_11px/1_var(--font-sans)] tracking-[.14em] uppercase text-[#1C1B19] cursor-pointer py-[12px] px-0">Close</button>
          </div>
        )}
        {groups.map(g => (
          <div key={g.title} className="py-[22px] px-0 [border-bottom:1px_solid_rgba(28,27,25,.1)]">
            <span className="block [font:400_11px/1_var(--font-mono)] tracking-[.12em] uppercase text-[#6B6761] mb-[16px]">{g.title}</span>
            <div className="flex flex-col gap-[4px]">
              {g.options.map(o => (
                <button
                  key={o.label} onClick={o.toggle} role="checkbox" aria-checked={o.on}
                  className="appearance-none [background:none] border-0 p-[7px_0] flex items-center gap-[12px] cursor-pointer [font:400_14px/1.2_var(--font-sans)] text-[#1C1B19] text-left"
                >
                  <span
                    className="w-[14px] h-[14px] flex-none box-border [transition:background_.25s,box-shadow_.25s]"
                    style={{
                      border: `1px solid ${o.swatch ? 'rgba(0,0,0,.18)' : '#1C1B19'}`, borderRadius: o.swatch ? '50%' : '0',
                      background: o.swatch ? o.swatch : (o.on ? '#1C1B19' : 'transparent'),
                      boxShadow: `inset 0 0 0 ${o.swatch ? (o.on ? '2px' : '0px') : (o.on ? '3px' : '0px')} #F7F5F1`
                    }}
                  />
                  <span className="flex-1">{o.label}</span>
                  <span className="[font:400_10px/1_var(--font-mono)] text-[#8A857D] pr-[4px]">{o.count}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
        {m && (
          <div className="sticky bottom-0 bg-[#F7F5F1] p-[16px_0_4px] flex gap-[12px]">
            <button onClick={onClear} className="flex-1 h-[54px] [border:1px_solid_#1C1B19] bg-transparent [font:500_12px/1_var(--font-sans)] tracking-[.12em] uppercase text-[#1C1B19] cursor-pointer">Clear</button>
            <button onClick={onClose} className="flex-[2] h-[54px] border-0 bg-[#1C1B19] text-[#F2EFEA] [font:500_12px/1_var(--font-sans)] tracking-[.12em] uppercase cursor-pointer">Show {count} products</button>
          </div>
        )}
      </aside>
    </>
  );
}
