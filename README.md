# Leave Your Legacy — Next.js store

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
components/brand/                    Logo (2D mark, wordmark, lockup), LogoMark3D (extruded mark), BrandScene (/brand turntable)
components/ui/ImageSlot.tsx          next/image wrapper that replaces <image-slot>
lib/catalogue.ts                     products + collections, verbatim from store.js
lib/cart-store.ts                    Zustand cart (same API, persisted to localStorage "leaveyourlegacy.cart.v1", migrating any old "halden.cart.v1" bag as a bare line array, cross-tab sync)
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

## Prices

The products are fictional. Each price is set to the current online price of a comparable real product, recorded in the product's `ref` field in `lib/catalogue.ts` (name, URL, date checked). Three prices are sums of single items, because the real equivalent isn't sold as a set: Monolith Set, Recovery Set and Studio Towels. Re-check the `ref` URLs periodically, since retail prices change.

## Imagery

The shop's product shots (`p-{id}-1` main, `p-{id}-2` hover angle) are stand-in Unsplash photos stored in `public/images/`. Photographer credits are in `IMAGE_CREDITS` in `lib/images.ts`. Replace them with real product photography when it exists.

All other imagery is still placeholder. To add a shot, drop the file into `public/images/` and register it in `lib/images.ts` under its slot id. Examples of slot ids are `p-form-bench-1`, `story-2`, `col-cardio`, `collection-home`, `home-edit-hero`, `statement`, `philosophy-detail` and `hero-poster`. The slot then renders through `next/image` instead of its art-direction caption.

- **Hero GLB:** `<HeroScene model="/models/form-bench.glb" />` replaces the procedural bench once the file exists in `public/models/`.
- **360° sequence:** add `spin: string[]` (36 frames) to a product in `lib/catalogue.ts`.

## Brand

The mark is L·Y·L: two L's facing each other with a Y rising between them, all three standing on one baseline. It's drawn on a 48-unit grid, and `MARK_PARTS` in `components/brand/Logo.tsx` is the single source for the SVG, the favicon (`app/icon.svg`) and the 3D extrusion. The 3D mark appears on the back wall of the hero room and on a turntable at `/brand`. That page also documents the logo, clear space, type and colour, and links the files in `public/brand/`: SVG marks, PNG lockups, the 3D render and `og.png`.
