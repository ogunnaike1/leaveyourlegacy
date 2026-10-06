import type { Metadata } from 'next';
import { Suspense } from 'react';
import InfoPage, { InfoBlock } from '@/components/layout/InfoPage';
import ContactForm from './ContactForm';

export const metadata: Metadata = { title: 'Contact — Leave Your Legacy' };

export default function ContactPage() {
  return (
    <InfoPage eyebrow="Service" title="Contact" intro="Questions about a piece, an order or planning a room. We reply within one working day.">
      <Suspense><ContactForm /></Suspense>
      <div className="mt-[56px]">
        <InfoBlock num="—" title="Showroom">
          <p className="m-0">Kalkbreite 4<br />8003 Zürich<br />By appointment — choose &ldquo;Showroom appointment&rdquo; above.</p>
        </InfoBlock>
        <InfoBlock num="—" title="Room planning">
          <p className="m-0">Our studio plans rooms free of charge — layout, flooring, light and clearances — before anything ships.</p>
        </InfoBlock>
      </div>
    </InfoPage>
  );
}
