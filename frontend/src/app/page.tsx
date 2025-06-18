// src/app/page.tsx
// NO 'use client' directive here - this is a pure Server Component by default

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';
// Importantly, 'useCartStore' is no longer imported here!
// Swiper imports are also moved to the client component.

// Import your new Client Components
import ProductCardClientActions from '@/components/product-card-client-actions';
import HomeHeroSwiper from '@/components/home-hero-swiper';

// Optional: Import Suspense for loading states for Client Components
import { Suspense } from 'react';

// Static data can remain here or be fetched on the server
import { products } from '@/lib/products'; // Assuming this data is pre-fetched/static
import { categories, vendors } from '@/lib/mock-data'; // Assuming this data is pre-fetched/static

export default function Home() {

  return (
    <main className="container mx-auto p-4">
      {/* Render the Client Component for the Swiper */}
      <Suspense fallback={<div>Loading banners...</div>}>
        <HomeHeroSwiper />
      </Suspense>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 md:text-2xl">Categories</h2>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Badge key={category.id} variant="secondary" className="px-3 py-1 text-md">
              {category.name}
            </Badge>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2 md:text-2xl">Featured Products</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <Link href={`/product/${product.id}`}>
                  <div className="relative w-full h-32 md:h-40">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
                      className="object-cover"
                    />
                  </div>
                </Link>
              </CardHeader>
              <CardContent className="p-2">
                <CardTitle className="text-sm truncate md:text-base">{product.name}</CardTitle>
                <p className="text-xs text-gray-600 md:text-sm">NPR {product.base_price}</p>
                <div className="flex items-center text-xs text-yellow-500 mt-1 md:text-sm">
                  <FaStar /> <span className="ml-1">4.5</span>
                </div>
                <p className="text-xs text-gray-500 md:text-sm">By {vendors.find((v) => v.id === product.vendor_id)?.name}</p>

                {/* Render the Client Component for product actions */}
                {/* Pass only static data as props */}
                <Suspense fallback={<div>Loading actions...</div>}>
                  <ProductCardClientActions
                    productId={product.id}
                    productName={product.name}
                    productPrice={product.base_price}
                  />
                </Suspense>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}