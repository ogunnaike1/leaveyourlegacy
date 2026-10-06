import type { Metadata } from 'next';
import { Archivo, Instrument_Serif, JetBrains_Mono, Jost } from 'next/font/google';
import MotionRoot from '@/components/motion/MotionRoot';
import './globals.css';

const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-archivo', display: 'swap' });
const instrument = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-instrument', display: 'swap' });
// Jost sets the brand wordmark (matches the supplied logo's lowercase geometric sans).
const jost = Jost({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-jost', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-jetbrains', display: 'swap' });

// Glyphs outside the latin subset (→ ← ✓ ★) must fall back to the generic sans/serif/monospace faces, as they
// do in the reference — not to next/font's metric-adjusted Arial, which draws a much wider arrow. So the font
// variables carry only the primary family; the generic fallback is appended in globals.css.
const primary = (f: { style: { fontFamily: string } }) => f.style.fontFamily.split(',')[0];
const fontVars = {
  '--font-archivo': primary(archivo),
  '--font-instrument': primary(instrument),
  '--font-jetbrains': primary(jetbrains),
  '--font-jost': primary(jost)
} as React.CSSProperties;

export const metadata: Metadata = {
  title: 'Leave Your Legacy — Performance without compromise',
  description: 'Strength equipment made with the precision of furniture and the tolerance of a commercial gym.',
  applicationName: 'Leave Your Legacy',
  openGraph: { siteName: 'Leave Your Legacy', title: 'Leave Your Legacy — Performance without compromise', images: ['/brand/og.png'] }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${instrument.variable} ${jetbrains.variable} ${jost.variable}`} style={fontVars}>
      <body>
        {children}
        <MotionRoot />
      </body>
    </html>
  );
}
