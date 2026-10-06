# HALDEN — Next.js store

A 1:1 port of the HTML prototype in `/design-reference` (the source of truth) to Next.js App Router, TypeScript and Tailwind CSS v4.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Structure

```
app/(store)/page.tsx                 Home           ← Home.dc.html
app/(store)/shop/                    Shop           ← Shop.dc.html   (?c=, ?line=, ?sort=, ?price=, ?equipment=, ?color=, ?avail=)
app/(store)/products/[id]/           Product        ← Product.dc.html
app/(store)/collections/             Collections    ← Collections.dc.html
app/checkout/                        Checkout       ← Checkout.dc.html (minimal header)
components/layout/                   Header, MobileMenu, SearchSheet, CartDrawer ← SiteHeader.dc.html; Footer ← SiteFooter.dc.html
components/home/                     Hero, HeroScene (R3F port of hero-scene.js), CollectionsEditorial, FeaturedGrid,
                                     ScrollStory, HomeEdit, Statement, Bestsellers, Philosophy
components/product/                  ProductCard ← ProductCard.dc.html; Gallery, ZoomStage, Spin360, ProductInfo, DetailsAccordion
components/shop/                     CategoryTabs, FilterPanel (sidebar ≥900px / bottom sheet <900px), SortSelect, ActiveChips
components/motion/                   engine.ts (port of motion.js), MotionRoot, LineReveal, Parallax, Magnetic, hover
components/ui/ImageSlot.tsx          next/image wrapper that replaces <image-slot>
lib/catalogue.ts                     products + collections, verbatim from store.js
lib/cart-store.ts                    Zustand cart (same API, persisted to localStorage "halden.cart.v1" as a bare line array, cross-tab sync)
```

## Motion

`components/motion/engine.ts` is a direct port of `motion.js`. It uses the same CSS-variable contract, and components read the variables with the same `calc()` formulas as the prototype:

| Attribute            | Variable          | Maths                                                          |
|----------------------|-------------------|----------------------------------------------------------------|
| `data-pin="--hp"`    | `--hp` / `--sp`   | `clamp(-rect.top / (height - innerHeight), 0, 1)`              |
| `data-parallax=".1"` | `--py`            | `(rect.top + rect.height/2 - innerHeight/2) * -factor`         |
| `data-reveal`        | `--in` (0 → 1)    | IntersectionObserver, threshold .12, rootMargin `0 0 -8% 0`    |
| `data-magnetic`      | `--mx` / `--my`   | ±3px / ±2px                                                    |
| `data-hover="1"`     | `--h`             | set by the `hover` handlers                                    |
| `data-cursor="Label"`| —                 | 84px stone disc, fine pointers only                            |

## Imagery

All imagery is placeholder until photography exists. To add a shot, drop the file into `public/images/` and register it in `lib/images.ts` under its slot id. Examples of slot ids are `p-form-bench-1`, `story-2`, `col-cardio`, `collection-home`, `home-edit-hero`, `statement`, `philosophy-detail` and `hero-poster`. The slot then renders through `next/image` instead of its art-direction caption.

- **Hero GLB:** `<HeroScene model="/models/form-bench.glb" />` replaces the procedural bench once the file exists in `public/models/`.
- **360° sequence:** add `spin: string[]` (36 frames) to a product in `lib/catalogue.ts`.
