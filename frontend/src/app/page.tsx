'use client';

import { Button } from '@/components/ui/button';
     import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
     import { Badge } from '@/components/ui/badge';
     import { categories, products } from '@/lib/mock-data';
     import { useCartStore } from '@/lib/store';
     import Link from 'next/link';

     export default function Home() {
       const { addItem } = useCartStore();

       return (
         <main className="container mx-auto p-4">
           <h1 className="text-3xl font-bold mb-6 text-center">Welcome to Nepal eCommerce</h1>
           <div className="mb-6">
             <h2 className="text-xl font-semibold mb-2">Categories</h2>
             <div className="flex gap-2 flex-wrap">
               {categories.map((category) => (
                 <Badge key={category.id} variant="secondary">
                   {category.name}
                 </Badge>
               ))}
             </div>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {products.map((product) => (
               <Card key={product.id}>
                 <CardHeader>
                   <img
                     src={product.image_url}
                     alt={product.name}
                     className="w-full h-48 object-cover rounded-md"
                   />
                 </CardHeader>
                 <CardContent>
                   <CardTitle className="text-lg">{product.name}</CardTitle>
                   <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                   <p className="text-lg font-bold">NPR {product.base_price}</p>
                   <div className="flex gap-2 mt-4">
                     <Link href={`/product/${product.id}`}>
                       <Button variant="outline">View</Button>
                     </Link>
                     <Button
                       onClick={() =>
                         addItem({
                           productId: product.id,
                           quantity: 1,
                           price: product.base_price,
                           name: product.name,
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
         </main>
       );
     }