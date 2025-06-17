// src/components/app-header.tsx
'use client'; // This component needs client-side hooks

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

export default function AppHeader() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white shadow-md p-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <Link href="/" className="text-2xl font-bold mb-4 md:mb-0 text-blue-600">
          Amigo PWA
        </Link>
        <form onSubmit={handleSearch} className="flex-grow max-w-xl mx-auto md:mx-4 w-full md:w-auto mb-4 md:mb-0">
          <Input
            type="text"
            placeholder="Search products (e.g., Dhaka Topi)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </form>
      </div>
    </header>
  );
}