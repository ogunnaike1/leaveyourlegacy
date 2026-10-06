import type { Metadata } from 'next';
import CheckoutView from './CheckoutView';

export const metadata: Metadata = { title: 'Checkout — Leave Your Legacy' };

export default function CheckoutPage() {
  return <CheckoutView />;
}
