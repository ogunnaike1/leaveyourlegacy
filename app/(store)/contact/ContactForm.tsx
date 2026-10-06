'use client';
import { useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';

const TOPICS = ['General', 'Orders & delivery', 'Returns', 'Showroom appointment', 'Room planning'];
const field = 'w-full box-border h-[54px] p-[0_16px] [border:1px_solid_rgba(28,27,25,.22)] bg-white text-[15px] text-[#1C1B19] [font-family:inherit] focus:outline-none focus:!border-[#1C1B19]';
const label = '[font:400_11px/1_var(--font-mono)] tracking-[.12em] uppercase text-[#6B6761]';
const err = 'text-[13px] text-[#9B3B2E]';

export default function ContactForm() {
  const q = useSearchParams();
  const initialTopic = TOPICS.includes(q.get('topic') || '') ? q.get('topic')! : 'General';
  const [v, setV] = useState({ name: '', email: '', topic: initialTopic, order: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [ref, setRef] = useState('');
  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV(s => ({ ...s, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setState('sending'); setErrors({});
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(v) });
      const j = await r.json();
      if (!r.ok) { setErrors(j.errors || {}); setState('idle'); return; }
      setRef(j.ref); setState('sent');
    } catch { setState('error'); }
  };

  if (state === 'sent') {
    return (
      <div role="status" className="py-[28px] [border-top:1px_solid_rgba(28,27,25,.14)] flex flex-col gap-[14px]">
        <p className="m-0 font-serif text-[36px] leading-[1.1]">Thank you, {v.name.split(' ')[0]}.</p>
        <p className="m-0 text-[15px] leading-[1.7] text-[#3A3835]">We&rsquo;ve received your message (reference {ref}) and will reply to {v.email} within one working day.</p>
      </div>
    );
  }
  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-[20px] pt-[28px] [border-top:1px_solid_rgba(28,27,25,.14)]">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-[20px]">
        <label className="flex flex-col gap-[10px]"><span className={label}>Name</span><input name="name" autoComplete="name" value={v.name} onChange={set('name')} className={field} aria-invalid={!!errors.name} />{errors.name && <span className={err}>{errors.name}</span>}</label>
        <label className="flex flex-col gap-[10px]"><span className={label}>Email</span><input name="email" type="email" autoComplete="email" value={v.email} onChange={set('email')} className={field} aria-invalid={!!errors.email} />{errors.email && <span className={err}>{errors.email}</span>}</label>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-[20px]">
        <label className="flex flex-col gap-[10px]"><span className={label}>Topic</span>
          <select name="topic" value={v.topic} onChange={set('topic')} className={field}>{TOPICS.map(t => <option key={t}>{t}</option>)}</select>
        </label>
        <label className="flex flex-col gap-[10px]"><span className={label}>Order number (optional)</span><input name="order" placeholder="LYL-000000" value={v.order} onChange={set('order')} className={field} /></label>
      </div>
      <label className="flex flex-col gap-[10px]"><span className={label}>Message</span>
        <textarea name="message" rows={6} value={v.message} onChange={set('message')} aria-invalid={!!errors.message} className={field.replace('h-[54px]', 'min-h-[160px]').replace('p-[0_16px]', 'p-[14px_16px]') + ' resize-y leading-[1.6]'} />
        {errors.message && <span className={err}>{errors.message}</span>}
      </label>
      {state === 'error' && <span className={err}>Something went wrong sending your message. Please try again.</span>}
      <button type="submit" disabled={state === 'sending'} className="self-start h-[58px] p-[0_34px] border-0 bg-[#1C1B19] text-[#F2EFEA] [font:500_12px/1_var(--font-sans)] tracking-[.14em] uppercase cursor-pointer [transition:background_.3s] hover:bg-black disabled:opacity-50">{state === 'sending' ? 'Sending…' : 'Send message'}</button>
    </form>
  );
}
