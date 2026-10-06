export const NAV = [
  { label: 'Shop', href: '/shop', key: 'shop' },
  { label: 'Gym', href: '/shop?line=gym', key: 'gym' },
  { label: 'Home', href: '/shop?line=home', key: 'home' },
  { label: 'Collections', href: '/collections', key: 'collections' }
].map((n, i) => ({ ...n, num: i + 1, delay: (0.15 + i * 0.07) + 's' }));
