// Discount codes accepted at checkout. Edit this table to add, change or retire codes.
export type Promo = { code: string; percent: number; label: string };

export const PROMOS: Promo[] = [
  { code: 'WELCOME10', percent: 10, label: '10% off your first order' }
];

export const findPromo = (input: string) => PROMOS.find(p => p.code === input.trim().toUpperCase());
