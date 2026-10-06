import type { Metadata } from 'next';
import InfoPage, { InfoBlock } from '@/components/layout/InfoPage';

export const metadata: Metadata = { title: 'Privacy — Leave Your Legacy' };

export default function PrivacyPage() {
  return (
    <InfoPage eyebrow="Legal" title="Privacy" intro="What we keep, why, and for how long. Last updated 6 October 2026.">
      <InfoBlock num="01" title="What we collect">
        <p className="m-0">The details you give us at checkout (name, email, phone, delivery address) to deliver your order; your email if you subscribe to the newsletter; and the message and contact details you send through the contact form.</p>
      </InfoBlock>
      <InfoBlock num="02" title="Stored on your device">
        <p className="m-0">Your bag and your order history are stored in your browser&rsquo;s local storage so they survive a reload. They never leave your device unless you place an order. Clearing your browser data removes them.</p>
      </InfoBlock>
      <InfoBlock num="03" title="How we use it">
        <p className="m-0">Only to fulfil orders, arrange delivery, answer your messages and — if you opted in — send four or five letters a year. We do not sell or share your data for advertising.</p>
      </InfoBlock>
      <InfoBlock num="04" title="Your rights">
        <p className="m-0">You can ask for a copy of your data, a correction, or deletion at any time through the contact form. Every newsletter has a one-click unsubscribe.</p>
      </InfoBlock>
    </InfoPage>
  );
}
