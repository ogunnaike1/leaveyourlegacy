import type { Metadata } from 'next';
import InfoPage, { InfoBlock } from '@/components/layout/InfoPage';

export const metadata: Metadata = { title: 'Shipping — Leave Your Legacy' };

export default function ShippingPage() {
  return (
    <InfoPage eyebrow="Service" title="Shipping" intro="Equipment arrives the way it should leave the workshop: carried in, assembled and levelled by our own team.">
      <InfoBlock num="01" title="White-glove delivery & installation — included">
        <p className="m-0">Equipment is delivered by our own two-person team, carried to the room, assembled, levelled and packaging removed. Typical lead time is 2–3 weeks in Europe and North America; made-to-order pieces 6–8 weeks.</p>
      </InfoBlock>
      <InfoBlock num="02" title="Kerbside delivery — included">
        <p className="m-0">For smaller items: mats, accessories and home pieces. Dispatched within 3–5 working days.</p>
      </InfoBlock>
      <InfoBlock num="03" title="Scheduled evening slot — $95">
        <p className="m-0">Choose a 2-hour window after 6pm. Select it at checkout and our delivery team will call to confirm the time.</p>
      </InfoBlock>
      <InfoBlock num="04" title="Scheduling">
        <p className="m-0">After you order, our delivery team calls within two working days to arrange a time. Stock status on each product page shows the expected dispatch window: in stock ships in 2 weeks, low stock in 1 week, made to order in 6–8 weeks.</p>
      </InfoBlock>
      <InfoBlock num="05" title="Taxes">
        <p className="m-0">Prices include VAT (8.1%), shown separately at checkout.</p>
      </InfoBlock>
    </InfoPage>
  );
}
