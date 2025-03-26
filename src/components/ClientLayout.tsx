'use client'

import { ErrorBoundary } from './ErrorBoundary'
import { I18nProvider } from './I18nProvider'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <ThemeProvider>
          <AuthProvider>
            <div className="dark:bg-gray-900 transition-colors">
              <Navbar />
              <main className="min-h-screen bg-gray-50 dark:bg-gray-800 pt-16">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </I18nProvider>
    </ErrorBoundary>
  )
}
