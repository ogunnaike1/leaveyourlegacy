import ImageSlot from '@/components/ui/ImageSlot';

export type View = { short: string; slot: string; cap: string };

/** The four photographic views, crossfading (.8s); the active one scales 2× from the cursor origin when zoomed. */
export default function ZoomStage({ views, active, zoom, origin }: { views: View[]; active: number; zoom: boolean; origin: string }) {
  return (
    <>
      {/* The 360° view (index 4) has no photo layer — Spin360 draws over the stage instead. */}
      {views.slice(0, 4).map((v, i) => {
        const on = active === i;
        return (
          <div key={v.slot} className="absolute inset-0 [transition:opacity_.8s_ease] text-[#8C877F]" style={{ opacity: on ? 1 : 0, pointerEvents: on ? 'auto' : 'none' }}>
            <div className="absolute inset-0 [transition:transform_.6s_cubic-bezier(.2,.7,.2,1)]" style={{ transformOrigin: origin, transform: `scale(${zoom && on ? 2 : 1})` }}>
              <ImageSlot id={v.slot} caption={v.cap} sizes="(max-width: 900px) 100vw, 55vw" priority={i === 0} />
            </div>
          </div>
        );
      })}
    </>
  );
}
