import { Inter } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import AppHeader from '@/components/app-header';
import AppFooterNav from '@/components/app-footer-nav';
import AppFooter from '@/components/app-footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Amigo eStore',
  description: 'Multivendor eCommerce Amigo eStore',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-100`}>
        <Suspense fallback={<div>Loading Header...</div>}>
          <AppHeader />
        </Suspense>

        <main className="flex-grow">{children}</main>

        <Suspense fallback={<div>Loading Navigation...</div>}>
          <div className="md:hidden">
            <AppFooterNav />
          </div>
        </Suspense>

        <AppFooter />
      </body>
    </html>
  );
}