import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Providers } from './providers';
import { FloatingChat } from './components/FloatingChat';
import { OpeningIntro } from './components/OpeningIntro';
import { PortfolioCursor } from './components/PortfolioCursor';
import '../styles/index.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' });

export const metadata: Metadata = {
  title: 'Reyca De Alba - Portfolio',
  icons: { icon: '/brand/reyca-mark.svg', apple: '/favicon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // next-themes sets the theme class before hydration
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <noscript><style>{'.portfolio-intro { display: none !important; }'}</style></noscript>
        <Providers>
          <OpeningIntro />
          <PortfolioCursor />
          <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            {children}
            <FloatingChat />
          </div>
        </Providers>
      </body>
    </html>
  );
}
