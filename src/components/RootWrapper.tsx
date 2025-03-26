'use client'

import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function RootWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50 dark:bg-gray-800 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  )
}
