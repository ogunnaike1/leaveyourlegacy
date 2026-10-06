# Handoff: HALDEN — Premium Equipment & Home Store

## Overview
HALDEN is a fictional Zürich-based brand selling professional/home gym equipment, fitness accessories and home/lifestyle objects. This package covers a small, art-directed ecommerce site: **Home, Shop, Product, Collections, Checkout**, plus a shared header (with search overlay, fullscreen mobile menu, cart drawer), footer/newsletter, and product card.

Target stack per original brief: **Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion + GSAP ScrollTrigger + React Three Fiber/drei**, shadcn/ui only where useful (Sheet, Select, Accordion, Checkbox), Lucide icons, `next/image`.

## About the Design Files
The files in this bundle are **design references created in HTML** — working prototypes showing intended look, copy and behaviour, not production code to copy. Recreate them in the target codebase (Next.js as above, or the existing app's environment) using its patterns. `.dc.html` files open directly in a browser (they load `support.js`); logic is in the `<script data-dc-script>` class at the bottom of each file, markup between `<x-dc>` tags. Inline styles are a prototype constraint — convert to Tailwind tokens/components.

## Fidelity
**High-fidelity.** Colours, type, spacing, copy, motion timings and interactions are final. Imagery is placeholder (drag-and-drop `<image-slot>`); 3D bench is a procedural placeholder for a GLB.

---

## Design Tokens

### Colour
| Token | Hex | Use |
|---|---|---|
| stone | `#F2EFEA` | Primary light bg, light text on dark |
| paper | `#F7F5F1` | Alternate light bg (Featured, Bestsellers, Shop, Product, drawer) |
| sand | `#EFEBE5` | Checkout summary panel |
| beige | `#E5DCCF` | Home Edit section bg |
| beige-ink | `#2A2520` | Text on beige; muted `#6B6258`, body `#4E463E` |
| charcoal | `#1C1B19` | Primary text, primary buttons |
| hero | `#141311` | Hero/3D bg + fog |
| story | `#1A1917` | Scroll-story / dark sections |
| night | `#121110` | Footer, mobile menu |
| grey-body | `#4A4743` | Body copy on light |
| grey-muted | `#6B6761` | Labels/meta on light (≥4.5:1) |
| grey-dark-muted | `#9C978F` / `#8A857D` | Labels on dark |
| on-dark-body | `#D9D3CA`, `#C9C2B8`, `#B9B3AA` | Body on dark |
| placeholder fills | `#E8E4DD`, `#DAD4CA`, `#E3DED6`, `#D6CBBB`, `#24221F` | Image backdrops |
| rules | `rgba(28,27,25,.14)` light / `rgba(242,239,234,.12–.2)` dark | 1px dividers |
| stock dot | `#5E7A5A` in stock, `#B08A4E` made to order/low |

Product finish swatches: Black Steel `#1d1c1a`, Stone `#cfc7bb`, Tan Leather `#9a7556`, Brushed Steel `#a9adb0`, Walnut `#5e4232`, Oat `#e2d9cb`, Charcoal `#3a3936`.

### Typography (Google Fonts)
- **Archivo** variable (`wdth 62–125`, `wght 300–700`) — UI/body and display.
  - Display: weight 500, `font-stretch: 80–84%`, uppercase, `letter-spacing: -.03em` to `-.04em`, line-height .82–.92.
    - Hero H1 `clamp(52px, 8.6vw, 150px)`; Shop/Collections H1 `clamp(64–72px, 11.5–13vw, 200–220px)`; section H2 `clamp(40px, 5vw, 84px)` to `clamp(48px, 6.8vw, 124px)`; Statement `clamp(60px, 11.5vw, 210px)`.
  - Wordmark "HALDEN": weight 600, `font-stretch: 118%` (footer 125%), `letter-spacing: .34em`, 17px desktop / 15px mobile.
  - Body 15–16px / 1.55–1.65; nav 13px/500/.06em; buttons 12px/500/.14em uppercase.
- **Instrument Serif** (regular + italic) — editorial accents: Home Edit headline, product names in Home rail (28px), "The Form Bench" (italic, `clamp(56px, 8vw, 128px)`), philosophy lede (`clamp(28px, 2.6vw, 40px)`), empty states.
- **JetBrains Mono** 400 — eyebrows/labels/prices: 10–11px, `letter-spacing .1–.14em`, uppercase; prices 12–13px (PDP 22px).

### Spacing & layout
- Page gutter: `clamp(20px, 3.4vw, 48px)`; max content width `1680px`.
- Section vertical padding: `clamp(88–96px, 10–12vw, 150–180px)`.
- Product grids: `repeat(auto-fill, minmax(min(calc(50% - 10px), 290–300px), 1fr))`, gap `56px 20px` (always ≥2 cols on mobile).
- Header height 76px desktop / 64px mobile.
- Buttons: height 54–58px (checkout 62px), padding `0 30px`, **square corners (radius 0 everywhere)**. Only circles: swatches, cart badge.
- Shadows: essentially none; cart drawer `-30px 0 60px rgba(0,0,0,.08)`.

### Motion
- Primary easing `cubic-bezier(.2,.7,.1,1)` (reveals), `cubic-bezier(.7,0,.2,1)` (drawers, clip-path reveals, menu).
- Line reveal: each line in `overflow:hidden` mask, inner translateY 108% → 0, 1.3–1.6s, 0.1–0.13s stagger.
- Image reveal: `clip-path: inset(100% 0 0 0)` → `inset(0)`, 1.6s.
- Hover image scale 1.025–1.035 over 1.4s; arrow nudge 5–8px over .5–.7s.
- Parallax factor 0.06–0.18 of distance from viewport centre.
- Magnetic buttons: max ±3px x / ±2px y.
- Respect `prefers-reduced-motion`: reveals shown immediately, parallax off, 3D snaps to scroll position without damping.

---

## Screens

### 1. Home (`Home.dc.html`)
1. **Hero (pinned, 300vh; sticky 100svh, bg `#141311`, dark header)** — full-bleed `<halden-scene>` WebGL canvas, gradient scrims (left 62%→0, bottom 60%→0, top 45%→0), SVG noise grain at 9% overlay. Three text states driven by scroll progress `p` (0–1):
   - p 0–0.22: eyebrow "Form Bench — Edition 01"; H1 "PERFORMANCE / WITHOUT COMPROMISE."; copy "Strength equipment made with the precision of furniture and the tolerance of a commercial gym."; buttons **Shop Equipment** (stone fill) → Shop?line=gym, **Explore Collection** (text + underline that retracts on hover, arrow nudges) → Collections. Fades out `1 - p*4.5`, rises 140px.
   - p 0.26–0.7: right-side spec block "BUILT LIKE FURNITURE. / RATED TO 450 KG." + 3 numbered rows (Seven back positions, from flat to 85° / 3mm steel frame, welded and ground flush by hand / Full-grain leather that darkens where you use it).
   - p > 0.76: "From $1,890 · Ships in 2 weeks", italic serif "The Form Bench", outlined button "View the bench →" → Product?id=form-bench.
   - Scroll cue (mono "SCROLL" + 48px line with looping fill, 2.6s) — hidden on viewport height < 700 or width < 640. 1px progress line at bottom.
   - Pointer-events only on the visible text state.
2. **Collections (stone)** — header "FOUR DISCIPLINES. / ONE STANDARD." + paragraph. Asymmetric editorial tiles (wrap to full width < 760px): Strength 56% (1/1.08), Cardio 36% offset 200px down (3/4), Home Gym 42% (4/3), Accessories 50% offset 140px (16/11). Each: clip-path reveal, parallax image, caption grid `[num | name + line | count →]`, hover scales image, shifts text 6px, slides arrow.
3. **Featured (paper)** — "ENGINEERED FOR MORE." + "Shop all equipment"; 8 ProductCards with staggered fade-up (80ms per column).
4. **Scroll story (pinned 440vh, `#1A1917`)** — desktop grid 38/62 (text left, image right); mobile image top 58% / text 42%. Headline "DESIGNED AROUND / THE WAY YOU MOVE." Four frames, transitions at p≈.25/.5/.75: 01 The whole object, 02 Material, 03 Mechanism, 04 In place (exact copy in file). Frames 2–3 reveal with bottom-up clip-path + scale 1.18→1.02; frame 4 reveals from the right. 4-segment progress bar.
5. **Home Edit (beige `#E5DCCF`)** — 4/5 interior image (inset clip reveal) + serif headline "For the rooms / *around the room.*", copy, link "Shop the Home Edit". Below: horizontal snap rail (`grid-auto-columns: clamp(250px,24vw,380px)`), prev/next square buttons, "Drag" cursor; cards with varied ratios, serif names, mono price, text "Add to bag" → "Added ✓" 1.8s (does not open drawer).
6. **Statement (120vh, dark)** — full-bleed parallax image (0.18), bottom scrim, "YOUR SPACE. / YOUR STANDARD." + mono location caption.
7. **Bestsellers (paper)** — "MOST LIVED WITH."; 6 square ProductCards with "No. 01–06" labels and persistent outlined "Add to bag" button (fills charcoal and reads "Added to bag ✓" for 1.8s; header count bumps).
8. **Philosophy (stone, `#philosophy`)** — left sticky (top 110px): "BUILT TO / LIVE WITH YOU." + 5/4 detail image (left-to-right clip reveal); right: serif lede + 4 principles (Materials that age well / Engineering you feel, not see / Proportion before performance / For training, and for living), each line-revealed.
9. **Footer** (see below).

### 2. Shop (`Shop.dc.html`)
- URL params: `?c=Strength|Cardio|Accessories|Home`, `?line=gym|home` (changes title to GYM/HOME + intro, and header active state).
- Huge title, intro paragraph; category tabs with superscript counts and animated 1px underline; toolbar: Filter toggle (shows active count), product count (mono), Sort select (Featured, Price low→high, high→low, Name).
- Active filter chips with × and "Clear all".
- Filters: Price (Under $250 / $250–$1,000 / $1,000–$5,000 / $5,000+), Equipment type (derived), Colour & finish (swatch checkboxes), Availability (In stock / Made to order). Counts are faceted (computed excluding the group's own selection).
- Desktop: 240px sticky sidebar, toggled by sliding (margin-left −296px + fade). Mobile (<900px): bottom sheet 86vh with scrim, sticky footer "Clear" / "Show N products".
- On any filter/sort change, grid items fade up (700ms, 45ms stagger). In production use Framer Motion `layout` + `AnimatePresence`.
- Empty state: serif "Nothing fits all of that." + Clear filters.

### 3. Product (`Product.dc.html?id=…`)
- Desktop: gallery (thumb column 72×90 + 4/5 stage, max-height `100vh - 140px`) left; info right, sticky top 110px, max 520px. Mobile: thumbs become a row under the stage.
- Views: Front ¾, Profile, Detail, In room, 360°. Crossfade .8s. Click stage toggles 2× zoom with transform-origin following the cursor; contextual cursor "Zoom"/"Close"/"Drag".
- 360° viewer: pointer-drag rotates (0.6°/px), 36 frames (frame = angle/10). Placeholder dial; production should load `product.spin: string[]` image sequence (preload, draw to canvas) or a GLB via R3F.
- Info: breadcrumb, name (display), type, ★ rating + reviews, price, description, Finish swatches (40px ring), qty stepper, **Add to bag** (charcoal, shows line total, "Added to bag ✓" 2s, opens drawer), **Buy now** (outlined → adds + goes to Checkout), stock line, delivery note.
- Details accordion: Description, Dimensions, Materials, Delivery, Warranty (one open at a time; + rotates 45°).
- "DESIGNED FOR / YOUR SPACE." full-bleed parallax interior section; "Pairs well with" 4 related cards.

### 4. Collections (`Collections.dc.html`)
- Title + anchor index. Five alternating full-width rows (image/text flip each row), alternating backgrounds (stone, dark `#1A1917`, paper, stone, beige). Each: image with clip reveal + parallax, "0N — X pieces", big name, copy, top-4 product list with prices, "Shop {name}" link.

### 5. Checkout (`Checkout.dc.html`)
- Minimal header (wordmark + "← Continue shopping"). Two columns; summary stacks above form on mobile (`flex-wrap: wrap-reverse`).
- 01 Contact (email, phone, marketing opt-in) · 02 Delivery (first/last, address, apt/access notes, city, postcode, country) · 03 Shipping radio cards (White-glove delivery & installation — Included; Kerbside — Included; Scheduled evening slot — $95) · 04 Payment segmented (Card / Bank transfer / Pay in 3) with card fields or explanatory note.
- Inputs: 54px, 1px `rgba(28,27,25,.22)` border, white fill, focus border charcoal.
- Summary (`#EFEBE5`): thumbs with qty badge, code field + Apply, Subtotal, Shipping, VAT (8.1% included), Total. "Place order" shows total; disabled at 40% when cart empty.
- Success: "Order HLD-xxxxxx", "THANK YOU.", confirmation copy, cart cleared.

### Shared: Header (`SiteHeader.dc.html`)
- Fixed; grid `1fr auto 1fr`: wordmark | nav (Shop, Gym, Home, Collections; 40px gap; underline scaleX on hover/active) | Search, Account, Bag + count.
- Theme auto-switches by section under it (`data-theme="dark|light"`): transparent over hero top, then blurred `rgba(21,20,19,.72)` or `rgba(242,239,234,.86)` with `saturate(1.2) blur(14px)`. Hides on scroll down past 600px, returns on scroll up.
- Cart count bump: scale 1.45 with overshoot easing `cubic-bezier(.3,1.6,.5,1)`, 320ms.
- **Search**: top sheet (translateY −102% → 0, .7s), giant input, live results (name/type/price) across name/type/category/materials; default shows bestsellers.
- **Mobile menu** (<900px): "Menu" button; fullscreen `#121110` revealed by `clip-path inset(0 0 100% 0)` → `inset(0)` .8s; items at `clamp(44px,13vw,72px)` slide up with 70ms stagger; secondary links at bottom.
- **Cart drawer**: right, `min(460px,100vw)`, translateX 102% → 0 (.75s), scrim fade .6s. Lines: 96×120 thumb, name, price, type · finish, qty stepper (−/+), Remove. Footer: Subtotal, note, Checkout button. Empty: serif "Your bag is empty." Esc closes all overlays; body scroll locked while open.

### Shared: Footer (`SiteFooter.dc.html`)
- `#121110`. Newsletter: "THE GOOD STUFF." + "Occasional product drops, training spaces and design inspiration. Four or five letters a year." Underlined email field + "Subscribe →" → inline thank-you.
- Link columns: Store (Shop, Collections, About), Service (Shipping, Returns, Contact), Follow (Instagram), Showroom (address). Oversized wordmark in `#2A2826`. Bottom: © 2026 Halden Studio AG · Privacy · Terms.

### Shared: ProductCard (`ProductCard.dc.html`)
- Props: `pid`, `ratio` (default 4/5), `number`, `alwaysAdd`.
- Image area bg `#E8E4DD`; hover: main image scales 1.03 (1.4s), alternate angle crossfades in (.7s), Quick Add bar (50px, `#F7F5F1`, label + price) rises 12px and fades in. Touch devices / `alwaysAdd`: persistent outlined button instead.
- Below: name (15/500) + mono price; type (13 grey) + finish dots (10px).

---

## Interactions & Behaviour Notes
- **No scroll hijacking.** Pinned sections use `position: sticky` inside tall wrappers; progress = `-rect.top / (height - innerHeight)`. Implement with GSAP ScrollTrigger (`scrub: true`, `pin` or sticky) or Framer `useScroll` + `useTransform`.
- **Custom cursor** only on `[data-cursor]` areas (collection images, product stage, Home rail): 84px stone disc with mono label, scale 0→1 .35s; fine pointers only.
- Hover states use a `--h` var toggled by a `data-hover` attribute in the prototype — in React use group-hover (Tailwind `group`) or Framer `whileHover` variants.
- Add to bag from cards/PDP opens drawer; from Home rail and Bestsellers it doesn't (inline confirmation instead).

## 3D Hero (`hero-scene.js`)
Reference for the R3F scene:
- Renderer: ACES Filmic, sRGB, exposure 0.92→1.02 across scroll, PCFSoft shadows (2048 desktop / 1024 lite), DPR ≤1.75 (≤1.25 lite).
- Room: concrete floor (noise albedo + roughness, ~0.82), plaster back/left walls (bump), steel-framed window opening on left with emissive glow plane, dark ceiling, shadow-gap skirting. Fog `#141311` 9–18.
- Environment: PMREM from a dim box room with a bright window panel (for believable reflections).
- Lights: hemisphere 0.18; directional "sun" through window `#ffdcb4`→`#f4efe8`, 2.7→2.0; warm spot wash on back wall; soft key spot front-right; warm point light in plaster lamp.
- Props: low walnut/steel rack with four urethane dumbbells, plaster column lamp.
- Bench (placeholder): powder-coated steel frame (metalness .15, rough .48), brushed aluminium pins/handle, rubber feet/wheels, leather pads (MeshPhysical, sheen .5, bump grain), radial contact-shadow decal.
- Camera: fov 30 (42 mobile); azimuth 0.92→0.26 rad, radius 3.7→3.05 (mobile 4.6→3.9), height 1.35→0.95; target ~(0, .36, -.1). Horizontal view offset moves product right (−17%) → left (+13%) → right (−16%) to make room for each text state. Bench rotates −0.12→0.1 rad; backrest inclines 0.38→0.62 rad. Damping 0.075 per frame; render on demand; pause when off-screen.
- **GLB swap:** `model` attribute loads via GLTFLoader and replaces the procedural bench. In R3F: `useGLTF('/models/form-bench.glb')`, `<ContactShadows>`, `<Environment>` (custom lightformers), `<AccumulativeShadows>` optional on desktop. Load the scene with `next/dynamic({ ssr:false })`; show the static poster image on mobile/low-power devices or if WebGL is unavailable.

## State Management
- **Catalogue** (`store.js`): 15 products `{id, name, type, category, equipment, line:'gym'|'home', price, colors[{name,hex}], stock, featured, best, rating, reviews, desc, dims, materials}`; collections strength, cardio, home-gym, accessories, home with membership rules in `inCollection()`. Replace with CMS/commerce API (Shopify Storefront, Medusa, etc.).
- **Cart**: lines `{key: id|color, id, color, qty}`, persisted to localStorage `halden.cart.v1`, synced across tabs. API: `add(id,color,qty,openDrawer)`, `setQty`, `remove`, `clear`, `count`, `subtotal`. In React: Zustand (persist middleware) or context; drawer open state global.
- Shop: `cat`, `line`, `sel{price[],equipment[],color[],avail[]}`, `sort`, `filtersOpen` — mirror to URL search params.
- PDP: `view`, `zoom + origin`, `spinAngle`, `color`, `qty`, `openAccordion`.
- Checkout: `email`, `shippingMethod`, `paymentMethod`, `placed`, `orderNo`.

## Assets
- All imagery is placeholder. Slot ids indicate the required shot, e.g. `p-{productId}-1..4` (front ¾, profile, detail, in room), `p-{id}-space` (wide interior), `story-1..4`, `col-*`, `collection-*`, `home-edit-hero`, `statement`, `philosophy-detail`. Captions in each placeholder describe the art direction (neutral grade, natural window light, architectural interiors, subtle grain).
- Icons: Lucide-style search, user, bag (1.4 stroke) — use `lucide-react` (`Search`, `User`, `ShoppingBag`) at 19px, strokeWidth 1.4.
- Fonts: Google Fonts via `next/font/google` (Archivo with `axes: ['wdth']`, Instrument Serif, JetBrains Mono).

## Suggested Next.js structure
```
app/(store)/page.tsx                 Home
app/(store)/shop/page.tsx            Shop (searchParams)
app/(store)/products/[id]/page.tsx   Product
app/(store)/collections/page.tsx
app/checkout/page.tsx                (minimal layout)
components/layout/{Header,Footer,CartDrawer,SearchSheet,MobileMenu}.tsx
components/home/{Hero,HeroScene,CollectionsEditorial,FeaturedGrid,ScrollStory,HomeEdit,Statement,Bestsellers,Philosophy}.tsx
components/product/{ProductCard,Gallery,ZoomStage,Spin360,ProductInfo,DetailsAccordion}.tsx
components/shop/{CategoryTabs,FilterPanel,FilterSheet,SortSelect,ActiveChips}.tsx
components/motion/{LineReveal,ClipReveal,Parallax,Magnetic,ContextCursor}.tsx
lib/{catalogue.ts,cart-store.ts,format.ts}
```

## Files
- `Home.dc.html`, `Shop.dc.html`, `Product.dc.html`, `Collections.dc.html`, `Checkout.dc.html` — pages
- `SiteHeader.dc.html`, `SiteFooter.dc.html`, `ProductCard.dc.html` — shared components
- `store.js` — catalogue + cart store
- `motion.js` — scroll progress, reveals, parallax, magnetic buttons, contextual cursor
- `hero-scene.js` — Three.js hero scene reference
- `image-slot.js`, `support.js` — prototype runtime only (not for production)
