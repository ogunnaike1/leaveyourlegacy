export const NAV = [
  { label: 'Home', href: '/', key: 'home' },
  { label: 'Shop', href: '/shop', key: 'shop' },
  { label: 'Gym', href: '/shop?line=gym', key: 'gym' },
  { label: 'Collections', href: '/collections', key: 'collections' }
].map((n, i) => ({ ...n, num: i + 1, delay: (0.15 + i * 0.07) + 's' }));
