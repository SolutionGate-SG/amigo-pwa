'use client';

import { Button } from '@/components/ui/button';
     import { Card, CardContent, CardHeader } from '@/components/ui/card';
     import { products, productVariants } from '@/lib/mock-data';
     import { useCartStore } from '@/lib/store';
     import { notFound } from 'next/navigation';

     interface ProductPageProps {
       params: { id: string };
     }

     export default function ProductPage({ params }: ProductPageProps) {
       const product = products.find((p) => p.id === parseInt(params.id));
       const variants = productVariants.filter((v) => v.product_id === parseInt(params.id));
       const { addItem } = useCartStore();

       if (!product) {
         notFound();
       }

       return (
         <main className="container mx-auto p-4">
           <Card>
             <CardHeader>
               <img
                 src={product.image_url}
                 alt={product.name}
                 className="w-full h-64 object-cover rounded-md"
               />
             </CardHeader>
             <CardContent>
               <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
               <p className="text-gray-600 mb-4">{product.description}</p>
               <p className="text-xl font-bold mb-4">NPR {product.base_price}</p>
               {variants.length > 0 && (
                 <div className="mb-4">
                   <h3 className="text-lg font-semibold">Variants</h3>
                   <div className="flex gap-2">
                     {variants.map((variant) => (
                       <Button
                         key={variant.id}
                         variant="outline"
                         onClick={() =>
                           addItem({
                             productId: product.id,
                             variantId: variant.id,
                             quantity: 1,
                             price: product.base_price + variant.price_adjustment,
                             name: `${product.name} (${variant.variant_value})`,
                           })
                         }
                       >
                         {variant.variant_value} (+NPR {variant.price_adjustment})
                       </Button>
                     ))}
                   </div>
                 </div>
               )}
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
             </CardContent>
           </Card>
         </main>
       );
     }