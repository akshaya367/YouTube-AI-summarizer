import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Lexicon | Elite YouTube AI Knowledge Assistant',
  description: 'Transform long-form videos into deep insights instantly with the world\'s most powerful AI analyzer.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth selection:bg-blue-600/30">
      <body className={`${outfit.variable} font-sans antialiased bg-black text-white relative overflow-x-hidden min-h-screen`}>
        {/* Grainy Noise Overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9999] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {children}
      </body>
    </html>
  );
}
