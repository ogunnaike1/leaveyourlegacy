import type { Metadata } from 'next';
import { Archivo, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import MotionRoot from '@/components/motion/MotionRoot';
import './globals.css';

// adjustFontFallback is off so glyphs outside the latin subset (→ ← ✓ ★) fall back to the generic
// sans/serif/monospace faces exactly as they do in the reference, not to a metric-adjusted Arial.
const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-archivo', display: 'swap', adjustFontFallback: false });
const instrument = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-instrument', display: 'swap', adjustFontFallback: false });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-jetbrains', display: 'swap', adjustFontFallback: false });

export const metadata: Metadata = {
  title: 'HALDEN — Performance without compromise',
  description: 'Strength equipment made with the precision of furniture and the tolerance of a commercial gym.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${instrument.variable} ${jetbrains.variable}`}>
      <body>
        {children}
        <MotionRoot />
      </body>
    </html>
  );
}
