"use client"; // This directive is essential for using hooks like useCartStore and Swiper

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// Data imports - assuming a consolidated mock-data file
import { products, categories, banners } from '@/lib/mock-data'; // Adjust path if your products are in a different file like '@/app/lib/products'
import { useCartStore } from '@/lib/store';

export default function Home() {
  const { addItem } = useCartStore(); // Destructure addItem for cleaner usage

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome to Amigo eStore!</h1>

      {/* Products Slider */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Top Deals</h2>
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={10}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }} // Keep autoplay even on interaction
          pagination={{ clickable: true }}
          className="rounded-lg shadow-md" // Added shadow for better visual separation
        >
          {/* Slice to show only a few products in the slider, e.g., first 5 */}
          {banners.slice(0, 5).map((banner) => (
            <SwiperSlide key={banner.id}>
              <Link href={`/banner/${banner.id}`}>
                <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96"> {/* Responsive height */}
                  <Image
                    src={banner.image_url}
                    alt={banner.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimize image loading
                    className="object-cover rounded-lg"
                    priority // Prioritize loading for above-the-fold content
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-4 rounded-b-lg">
                    <h3 className="text-xl font-bold truncate">{banner.name}</h3>
                    {/* <p className="text-lg">NPR {banner.base_price}</p> */}
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Categories */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Browse Categories</h2>
        <div className="flex gap-3 flex-wrap justify-start"> {/* Added justify-center for better alignment */}
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.name.toLowerCase()}`}> {/* Link to category page */}
              <Badge variant="secondary" className="px-4 py-2 text-base cursor-pointer hover:bg-gray-200 transition-colors">
                {category.name}
              </Badge>
            </Link>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> {/* Improved responsive grid */}
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden transform transition-transform hover:scale-105 shadow-lg"> {/* Added hover effect and more shadow */}
              <CardHeader className="p-0">
                <Link href={`/product/${product.id}`}>
                  <div className="relative w-full h-40 sm:h-48"> {/* Slightly larger image area */}
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw" // Optimize image loading
                      className="object-cover rounded-t-md" // Only top corners rounded
                    />
                  </div>
                </Link>
              </CardHeader>
              <CardContent className="p-3"> {/* Adjusted padding */}
                <CardTitle className="text-base font-semibold truncate mb-1">{product.name}</CardTitle> {/* More precise font and margin */}
                {/* <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p> Uncomment if product description is desired */}
                <p className="text-lg font-bold text-blue-700">NPR {product.base_price}</p> {/* Highlight price */}
                <div className="flex gap-2 mt-3"> {/* Adjusted margin-top */}
                  <Link href={`/product/${product.id}`} className="flex-1"> {/* Make link fill available space */}
                    <Button variant="outline" className="w-full text-sm">
                      View
                    </Button>
                  </Link>
                  <Button
                    size="default" // Use default size for better click target
                    className="flex-1 text-sm bg-blue-600 hover:bg-blue-700" // Custom color for Add to Cart
                    onClick={() =>
                      addItem({
                        productId: product.id,
                        quantity: 1,
                        price: product.base_price,
                        name: product.name,
                        image_url: product.image_url, // Added image_url to cart item
                      })
                    }
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}