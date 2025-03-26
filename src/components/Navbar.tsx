'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { LanguageSelector } from './LanguageSelector';
import { DocumentIcon } from '@heroicons/react/24/solid';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useTheme } from 'next-themes';

export function Navbar() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <DocumentIcon className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              PDF Processor
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/tools"
              className="text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {t('common.tools')}
            </Link>
            <Link
              href="/pricing"
              className="text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {t('common.pricing')}
            </Link>
            <Link
              href="/about"
              className="text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {t('common.about')}
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Contact Us
            </Link>
          </div>

          {/* Right side utilities */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5 text-yellow-500" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-600" />
              )}
            </button>

            {/* Auth buttons */}
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {t('common.dashboard')}
                </Link>
                <button
                  onClick={signOut}
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
                >
                  {t('common.signOut')}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {t('common.signIn')}
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('common.signUp')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg
              className="h-6 w-6 text-gray-600 dark:text-gray-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 py-4">
            <div className="space-y-4 divide-y divide-gray-200 dark:divide-gray-700">
              <div className="pb-4 space-y-3">
                <Link
                  href="/tools"
                  className="block text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('common.tools')}
                </Link>
                <Link
                  href="/pricing"
                  className="block text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('common.pricing')}
                </Link>
                <Link
                  href="/about"
                  className="block text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('common.about')}
                </Link>
                <Link
                  href="/contact"
                  className="block text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact Us
                </Link>
              </div>
              <div className="pt-4">
                {user ? (
                  <div className="space-y-3">
                    <Link
                      href="/dashboard"
                      className="block text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('common.dashboard')}
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left text-gray-600 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400"
                    >
                      {t('common.signOut')}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/auth/signin"
                      className="block text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('common.signIn')}
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('common.signUp')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
