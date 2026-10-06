import type { Metadata } from 'next';
import InfoPage, { InfoBlock } from '@/components/layout/InfoPage';

export const metadata: Metadata = { title: 'Terms — Leave Your Legacy' };

export default function TermsPage() {
  return (
    <InfoPage eyebrow="Legal" title="Terms" intro="The terms that apply when you order from Leave Your Legacy. Last updated 6 October 2026.">
      <InfoBlock num="01" title="Orders and prices">
        <p className="m-0">Prices are shown in US dollars and include VAT. An order is confirmed when you receive your confirmation email with an order number starting LYL-.</p>
      </InfoBlock>
      <InfoBlock num="02" title="Payment">
        <p className="m-0">We accept card, bank transfer (orders are reserved for 7 days and scheduled for delivery once payment clears) and Pay in 3 (three interest-free payments over 60 days).</p>
      </InfoBlock>
      <InfoBlock num="03" title="Delivery">
        <p className="m-0">Lead times are estimates: 2–3 weeks for in-stock equipment, 6–8 weeks for made-to-order pieces. We will contact you if anything changes.</p>
      </InfoBlock>
      <InfoBlock num="04" title="Trial, returns and warranty">
        <p className="m-0">Every piece includes a 30-day trial in your home with free collection on equipment. Frames and welds carry a 10-year warranty; upholstery, moving parts and electronics 3 years.</p>
      </InfoBlock>
    </InfoPage>
  );
}
