import type { Metadata } from 'next';
import InfoPage from '@/components/layout/InfoPage';
import AccountView from './AccountView';

export const metadata: Metadata = { title: 'Account — Leave Your Legacy' };

export default function AccountPage() {
  return (
    <InfoPage eyebrow="Account" title="Your orders" intro="Orders placed on this device. For changes to an order, send us its number through the contact form.">
      <AccountView />
    </InfoPage>
  );
}
