import type { Metadata } from 'next';
import CheckoutView from './CheckoutView';

export const metadata: Metadata = { title: 'Checkout — HALDEN' };

export default function CheckoutPage() {
  return <CheckoutView />;
}
