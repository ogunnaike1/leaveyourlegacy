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

The logo comes from the supplied artwork in `public/brand/logo-original.png`.
- **Mark:** two stepped L's joined by a sweep, traced to a vector path in `components/brand/mark-path.ts`. That one path drives the SVG mark, the favicon (`app/icon.svg`) and the 3D extrusion (`LogoMark3D`).
- **Wordmark:** "leaveyourlegacy" in Jost, with "your" in brass.
- **Colour:** brass (#A8865A) is the original gold, toned to sit with the site's charcoal and stone. Use charcoal or stone for one-colour versions.
- **3D:** a brass mark hangs on the back wall of the hero room, and `/brand` has a turntable version. That page also documents the system and links the files in `public/brand/`.

## Images and performance

- **Adding or replacing photos:** after changing anything in `public/images/`, run `npm run images`. It resizes product shots to a 1600px maximum and other photos to 2400px, re-encodes them as progressive JPEG (quality 76), and regenerates the blur placeholders in `lib/image-blur.json`. Then register the photo's slot id in `lib/images.ts`.
- **What visitors download:** Next.js serves each photo as AVIF or WebP at the width the layout needs. These copies are cached for 31 days. Source photos and brand files are cached for a week.
- **Homepage 3D:** the hero scene (three.js) only starts loading once the page is idle, so text, fonts and navigation load first.

## Testing

`tests/e2e.mjs` drives the real site in Chrome and checks every user-facing function (35 checks):
- **Pages and links:** every page and internal link loads, and the navbar works.
- **Search:** live results, Enter opening the results page, and the single-match jump to a product.
- **Shop:** filters, sort and URL state.
- **Bag:** add to bag from every place it appears, plus the cart drawer.
- **Product page:** gallery, zoom and 360°.
- **Checkout:** discount code, card validation and order placement, then the order showing on the account page.
- **Forms:** newsletter and contact.
- **Mobile:** menu, filters and search on a phone.

```bash
npm run build && npm start      # in one terminal
npm run test:e2e                # in another (BASE_URL=… to test a deployed site)
```

## Before going live

- **Payments:** checkout validates cards but does not charge them. Connect a payment provider (e.g. Stripe) in `app/checkout/CheckoutView.tsx`.
- **Newsletter and contact forms:** they validate and accept submissions (`app/api/newsletter`, `app/api/contact`), but nothing is sent until you connect an email service where the `TODO`s are.
- **Orders and accounts:** orders are kept in the visitor's browser (`lib/orders.ts`). A real store needs a database and sign-in.
- **Discount codes:** codes live in `lib/promo.ts`. `WELCOME10` is an example.
- **Instagram:** the link is set in `lib/site.ts`.
- **Legal pages:** have the Privacy and Terms copy reviewed.
