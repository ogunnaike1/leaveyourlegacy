import { NextResponse } from 'next/server';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Newsletter sign-up. Validates the address; connect your email provider (Mailchimp, Klaviyo…) where marked. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  if (!EMAIL.test(email)) return NextResponse.json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 });
  // TODO: add `email` to the mailing list with your provider's API.
  console.info('[newsletter] subscribe', email);
  return NextResponse.json({ ok: true });
}
