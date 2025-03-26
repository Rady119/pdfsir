'use client';

import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';
import './globals.css';

function initApp() {
  // Theme detection once mounted
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const updateTheme = (e) => {
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  };
  darkModeMediaQuery.addListener(updateTheme);
  updateTheme(darkModeMediaQuery);

  return () => {
    darkModeMediaQuery.removeListener(updateTheme);
  };
}

export default function MainApp({ children }) {
  useEffect(() => {
    return initApp();
  }, []);

  return (
    <div className="main-app">
      {children}
    </div>
  );
}