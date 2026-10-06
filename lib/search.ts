import { products, type Product } from './catalogue';

/** Product search used by the search sheet and the shop (?q=): every word must appear in name, type, category or materials. */
export function searchProducts(q: string, list: Product[] = products): Product[] {
  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return list;
  return list.filter(p => {
    const hay = (p.name + ' ' + p.type + ' ' + p.category + ' ' + p.equipment + ' ' + p.materials + ' ' + p.colors.map(c => c.name).join(' ')).toLowerCase();
    return words.every(w => hay.includes(w));
  });
}
