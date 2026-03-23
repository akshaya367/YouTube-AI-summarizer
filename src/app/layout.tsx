import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'YouTube AI Summarizer | Elite Knowledge Assistant',
  description: 'Transform any YouTube video into high-impact insights, study guides, and actionable takeaways using advanced AI.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-black text-white min-h-screen selection:bg-blue-600/30`}>
        {children}
      </body>
    </html>
  );
}
