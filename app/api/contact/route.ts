import { NextResponse } from 'next/server';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TOPICS = ['General', 'Orders & delivery', 'Returns', 'Showroom appointment', 'Room planning'];

/** Contact form. Validates the message; connect an email/helpdesk service (Resend, Postmark, Zendesk…) where marked. */
export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  const name = String(b?.name ?? '').trim(), email = String(b?.email ?? '').trim();
  const topic = String(b?.topic ?? 'General'), message = String(b?.message ?? '').trim(), order = String(b?.order ?? '').trim();
  const errors: Record<string, string> = {};
  if (!name) errors.name = 'Please tell us your name.';
  if (!EMAIL.test(email)) errors.email = 'Please enter a valid email address.';
  if (!TOPICS.includes(topic)) errors.topic = 'Please choose a topic.';
  if (message.length < 10) errors.message = 'Please write a little more (at least 10 characters).';
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 400 });
  // TODO: forward { name, email, topic, order, message } to your inbox or helpdesk.
  console.info('[contact]', { name, email, topic, order, length: message.length });
  return NextResponse.json({ ok: true, ref: 'MSG-' + Date.now().toString(36).toUpperCase() });
}
