// src/app/layout.tsx
// NO 'use client' directive here! This is now a pure Server Component.

import { Inter } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next'; // Import Metadata type
import { Suspense } from 'react'; // Import Suspense for the client components

// Import your new Client Components
import AppHeader from '@/components/app-header';
import AppFooterNav from '@/components/app-footer-nav';

const inter = Inter({ subsets: ['latin'] });

// Define Metadata here, as it's a Server Component
export const metadata: Metadata = {
  title: 'Amigo eStore PWA',
  description: 'Multivendor eCommerce Amigo eStore PWA',
  manifest: '/manifest.json', // Your PWA manifest
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-100`}>
        {/* Wrap client header in Suspense */}
        <Suspense fallback={<div>Loading Header...</div>}>
          <AppHeader />
        </Suspense>

        {/* Main Content */}
        <main className="flex-grow mb-16">{children}</main>

        {/* Wrap client footer nav in Suspense */}
        <Suspense fallback={<div>Loading Navigation...</div>}>
          <AppFooterNav />
        </Suspense>
      </body>
    </html>
  );
}