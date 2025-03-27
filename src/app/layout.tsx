import { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';
import Script from 'next/script';
import { SpeedInsightsWrapper } from '../components/SpeedInsightsWrapper';

export const metadata: Metadata = {
  title: 'PDF Tools',
  description: 'Professional PDF tools for everyone. Convert, compress, merge and more.',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  // Theme color will be handled dynamically with meta tag
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
        <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
        <meta name="google-site-verification" content="KlnSQy_TvA1Fii0qgLTL58PSredHBIgXfOzyU1uQwiA" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
        <Script id="prevent-flash" strategy="beforeInteractive">
          {`
            (function() {
              try {
                const theme = localStorage.getItem('theme');
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                
                if (theme === 'dark' || (!theme && systemDark)) {
                  document.documentElement.classList.add('dark');
                } else if (theme === 'light' || (!theme && !systemDark)) {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            })()
          `}
        </Script>
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
        <SpeedInsightsWrapper />
      </body>
    </html>
  );
}
