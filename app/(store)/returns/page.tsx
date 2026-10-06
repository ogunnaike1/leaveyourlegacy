import type { Metadata } from 'next';
import Link from 'next/link';
import InfoPage, { InfoBlock } from '@/components/layout/InfoPage';

export const metadata: Metadata = { title: 'Returns — Leave Your Legacy' };

export default function ReturnsPage() {
  return (
    <InfoPage eyebrow="Service" title="Returns" intro="Live with it first. If a piece doesn't earn its place in the room, we take it back.">
      <InfoBlock num="01" title="30-day trial in your home">
        <p className="m-0">Every piece comes with a 30-day trial from the day it is delivered. If it isn&rsquo;t right, tell us within the 30 days for a full refund.</p>
      </InfoBlock>
      <InfoBlock num="02" title="Free collection on equipment">
        <p className="m-0">For equipment we collect it ourselves, disassembled and carried out by the same two-person team, at no cost. Smaller items can be returned by post in their original packaging.</p>
      </InfoBlock>
      <InfoBlock num="03" title="Warranty">
        <p className="m-0">10 years on frames and welds, 3 years on upholstery, moving parts and electronics. Parts and refinishing are available for the life of the product.</p>
      </InfoBlock>
      <InfoBlock num="04" title="Start a return">
        <p className="m-0">Send us your order number (it starts with LYL-) through the <Link href="/contact?topic=Returns">contact form</Link> and we&rsquo;ll arrange collection.</p>
      </InfoBlock>
    </InfoPage>
  );
}
