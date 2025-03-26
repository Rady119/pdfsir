'use client';

import { ThemeProvider } from 'next-themes';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';
import { ReactNode, useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { AuthProvider } from '@/context/AuthContext';
import { Footer } from '@/components/Footer';

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [dir, setDir] = useState<'ltr' | 'rtl'>('rtl');

  useEffect(() => {
    setMounted(true);

    // Set initial direction based on language
    const currentLang = i18n.language;
    setDir(currentLang === 'ar' ? 'rtl' : 'ltr');

    // Listen for language changes
    const handleLanguageChange = (lang: string) => {
      setDir(lang === 'ar' ? 'rtl' : 'ltr');
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={true}
    >
      <AuthProvider>
        <I18nextProvider i18n={i18n}>
          <div dir={dir} className="min-h-screen flex flex-col transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </I18nextProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
