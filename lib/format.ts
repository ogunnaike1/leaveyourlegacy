// Whole-dollar prices render as "$3,300"; prices with cents keep them exactly ("$220.99").
export const money = (n: number) => {
  const cents = Math.round(n * 100);
  const whole = cents % 100 === 0;
  return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: whole ? 0 : 2 });
};
