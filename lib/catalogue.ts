// HALDEN — catalogue. Ported verbatim from design-reference/store.js.

export type Color = { name: string; hex: string };
export type Stock = 'In stock' | 'Made to order' | 'Low stock';
export type Product = {
  id: string;
  name: string;
  type: string;
  category: 'Strength' | 'Cardio' | 'Accessories' | 'Home';
  equipment: string;
  line: 'gym' | 'home';
  price: number;
  colors: Color[];
  stock: Stock;
  featured: 0 | 1;
  best: 0 | 1;
  rating: number;
  reviews: number;
  desc: string;
  dims: string;
  materials: string;
  /** Optional 36-frame 360° render sequence (Spin360). */
  spin?: string[];
};
export type Collection = { id: string; name: string; line: string; count: number };

const C = {
  black: { name: 'Black Steel', hex: '#1d1c1a' },
  stone: { name: 'Stone', hex: '#cfc7bb' },
  tan: { name: 'Tan Leather', hex: '#9a7556' },
  steel: { name: 'Brushed Steel', hex: '#a9adb0' },
  walnut: { name: 'Walnut', hex: '#5e4232' },
  oat: { name: 'Oat', hex: '#e2d9cb' },
  char: { name: 'Charcoal', hex: '#3a3936' }
};

export const products: Product[] = [
  { id: 'form-bench', name: 'Form Bench', type: 'Adjustable Bench', category: 'Strength', equipment: 'Benches', line: 'gym', price: 1890, colors: [C.black, C.tan, C.stone], stock: 'In stock', featured: 1, best: 1, rating: 4.9, reviews: 212,
    desc: 'Seven back positions, three seat angles and a frame welded from 3mm steel. Upholstered in full-grain leather that softens with use.',
    dims: 'L 132 × W 62 × H 46 cm · 38 kg · Rated to 450 kg', materials: 'Powder-coated 3mm steel, full-grain leather, dense closed-cell foam, rubber feet' },
  { id: 'olympic-bar', name: 'Bar 20', type: 'Olympic Barbell', category: 'Strength', equipment: 'Bars & Plates', line: 'gym', price: 640, colors: [C.steel, C.black], stock: 'In stock', featured: 1, best: 0, rating: 4.8, reviews: 96,
    desc: 'A 20 kg competition-spec bar with a dual-marked medium knurl and needle-bearing sleeves that spin quietly under load.',
    dims: 'L 220 cm · Ø 28 mm shaft · 20 kg', materials: 'Stainless steel shaft, hard-chrome sleeves, needle bearings' },
  { id: 'monolith-dumbbells', name: 'Monolith Set', type: 'Urethane Dumbbell Set', category: 'Strength', equipment: 'Free Weights', line: 'gym', price: 3450, colors: [C.black, C.stone], stock: 'In stock', featured: 1, best: 1, rating: 4.9, reviews: 148,
    desc: 'Ten pairs from 2 to 24 kg, cast with a dense urethane shell and a precision-turned steel handle. No odour, no chipping, no rattle.',
    dims: '2–24 kg in 10 pairs · Rack sold separately', materials: 'Urethane, solid steel core, knurled steel handle' },
  { id: 'axis-cable', name: 'Axis Station', type: 'Cable Training Station', category: 'Strength', equipment: 'Machines', line: 'gym', price: 7900, colors: [C.black, C.stone], stock: 'Made to order', featured: 1, best: 0, rating: 5.0, reviews: 41,
    desc: 'A dual-stack functional trainer with 22 pulley positions, sealed bearings and a 2:1 ratio for smooth, quiet resistance.',
    dims: 'H 218 × W 152 × D 94 cm · 2 × 90 kg stacks', materials: 'Powder-coated steel, aircraft cable, glass-filled nylon pulleys, walnut handles' },
  { id: 'line-treadmill', name: 'Line Treadmill', type: 'Performance Treadmill', category: 'Cardio', equipment: 'Machines', line: 'gym', price: 9400, colors: [C.char, C.stone], stock: 'Made to order', featured: 1, best: 1, rating: 4.8, reviews: 63,
    desc: 'A slat-belt treadmill with a 4 hp brushless motor and a deck that absorbs impact without feeling soft. Folds nothing, hides nothing.',
    dims: 'L 196 × W 86 × H 142 cm · 0.8–22 km/h · 0–15%', materials: 'Steel chassis, rubber slats, anodised aluminium rails' },
  { id: 'adjust-kettlebell', name: 'Kettle 32', type: 'Adjustable Kettlebell', category: 'Strength', equipment: 'Free Weights', line: 'gym', price: 520, colors: [C.black], stock: 'In stock', featured: 1, best: 0, rating: 4.7, reviews: 87,
    desc: 'Eight weights from 8 to 32 kg in one cast body. A single dial locks plates in place; the handle stays the same shape at every load.',
    dims: '8–32 kg in 4 kg steps · H 31 cm', materials: 'Cast iron, steel plates, powder coat' },
  { id: 'still-rower', name: 'Still Rower', type: 'Water Rower', category: 'Cardio', equipment: 'Machines', line: 'gym', price: 3200, colors: [C.walnut, C.black], stock: 'In stock', featured: 0, best: 1, rating: 4.9, reviews: 119,
    desc: 'Water resistance, a solid walnut frame and a sound you will actually like. Stands upright against a wall when you are done.',
    dims: 'L 210 × W 56 × H 51 cm', materials: 'Oiled American walnut, polycarbonate tank, steel rail' },
  { id: 'ledge-rack', name: 'Ledge Rack', type: 'Designer Storage Rack', category: 'Strength', equipment: 'Storage', line: 'gym', price: 2150, colors: [C.black, C.walnut], stock: 'In stock', featured: 1, best: 0, rating: 4.8, reviews: 52,
    desc: 'A two-tier rack in folded steel with walnut cradles. Holds the full Monolith set and looks considered doing it.',
    dims: 'W 140 × D 48 × H 76 cm', materials: 'Folded 4mm steel, oiled walnut' },
  { id: 'recovery-set', name: 'Recovery Set', type: 'Recovery Roller Set', category: 'Accessories', equipment: 'Recovery', line: 'gym', price: 180, colors: [C.char, C.oat], stock: 'In stock', featured: 1, best: 1, rating: 4.7, reviews: 304,
    desc: 'Two densities of roller and a lacrosse ball in a waxed canvas carry. For the work after the work.',
    dims: 'Ø 15 × 45 cm · Ø 10 × 30 cm · Ø 6 cm ball', materials: 'EVA foam, natural rubber, waxed cotton canvas' },
  { id: 'ground-mat', name: 'Ground Mat', type: 'Training Mat', category: 'Accessories', equipment: 'Mats', line: 'home', price: 340, colors: [C.char, C.oat, C.tan], stock: 'In stock', featured: 0, best: 1, rating: 4.8, reviews: 176,
    desc: 'Six millimetres of natural rubber bonded to a vegetable-tanned leather edge. Grips without sticking, rolls flat after years.',
    dims: '190 × 70 cm · 6 mm', materials: 'Natural tree rubber, vegetable-tanned leather binding' },
  { id: 'arc-mirror', name: 'Arc Mirror', type: 'Sculptural Floor Mirror', category: 'Home', equipment: 'Interior', line: 'home', price: 1280, colors: [C.steel, C.black], stock: 'In stock', featured: 0, best: 0, rating: 4.9, reviews: 38,
    desc: 'A full-height arched mirror on a brushed steel plinth. Low-iron glass for an honest reflection without the green cast.',
    dims: 'H 190 × W 70 cm · 24 kg', materials: 'Low-iron glass, brushed stainless steel' },
  { id: 'studio-towels', name: 'Studio Towels', type: 'Towel Set of Three', category: 'Home', equipment: 'Textiles', line: 'home', price: 120, colors: [C.oat, C.char], stock: 'In stock', featured: 0, best: 0, rating: 4.8, reviews: 221,
    desc: 'Long-staple Turkish cotton, loomed at 600 gsm and washed twice before it reaches you. Hand, gym and bath sizes.',
    dims: '30 × 50 · 50 × 100 · 70 × 140 cm', materials: '100% Turkish cotton' },
  { id: 'vessel-bottle', name: 'Vessel', type: 'Insulated Bottle', category: 'Home', equipment: 'Accessories', line: 'home', price: 68, colors: [C.steel, C.char, C.oat], stock: 'In stock', featured: 0, best: 1, rating: 4.6, reviews: 412,
    desc: 'A double-walled steel bottle with a walnut cap. Cold for 24 hours, quiet when you put it down.',
    dims: '750 ml · H 26 cm', materials: 'Stainless steel, walnut, silicone seal' },
  { id: 'plinth-lamp', name: 'Plinth Lamp', type: 'Ambient Floor Lamp', category: 'Home', equipment: 'Lighting', line: 'home', price: 690, colors: [C.stone, C.black], stock: 'Low stock', featured: 0, best: 0, rating: 4.9, reviews: 27,
    desc: 'A cast plaster column with a warm 2700K source hidden in its crown. Dims to almost nothing for late sessions.',
    dims: 'H 120 × Ø 22 cm', materials: 'Cast plaster, steel base, dimmable LED' },
  { id: 'tray-organiser', name: 'Tray Organiser', type: 'Walnut Organiser', category: 'Home', equipment: 'Storage', line: 'home', price: 210, colors: [C.walnut], stock: 'In stock', featured: 0, best: 0, rating: 4.7, reviews: 64,
    desc: 'A shallow tray in solid walnut for chalk, straps, keys and the small things that otherwise end up on the floor.',
    dims: 'W 42 × D 24 × H 5 cm', materials: 'Solid oiled walnut, felt base' }
];

export const byId = (id: string) => products.find(p => p.id === id);

export function inCollection(cid: string): Product[] {
  if (cid === 'strength') return products.filter(p => p.category === 'Strength');
  if (cid === 'cardio') return products.filter(p => p.category === 'Cardio');
  if (cid === 'home-gym') return products.filter(p => ['form-bench', 'monolith-dumbbells', 'ledge-rack', 'still-rower', 'ground-mat', 'arc-mirror'].includes(p.id));
  if (cid === 'accessories') return products.filter(p => p.category === 'Accessories');
  if (cid === 'home') return products.filter(p => p.line === 'home');
  return products;
}

export const collections: Collection[] = [
  { id: 'strength', name: 'Strength', line: 'Benches, bars, racks and free weights.', count: 0 },
  { id: 'cardio', name: 'Cardio', line: 'Treadmills and rowers built to be looked at.', count: 0 },
  { id: 'home-gym', name: 'Home Gym', line: 'Complete rooms, planned to the centimetre.', count: 0 },
  { id: 'accessories', name: 'Accessories', line: 'Mats, recovery and the details in between.', count: 0 },
  { id: 'home', name: 'Home', line: 'Mirrors, light, textiles and storage.', count: 0 }
].map(c => ({ ...c, count: inCollection(c.id).length }));
