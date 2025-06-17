'use client';

   import { Button } from '@/components/ui/button';
   import { Card, CardContent, CardHeader } from '@/components/ui/card';
   import Image from 'next/image';
   import { products, productVariants } from '@/lib/products';
   import { useCartStore } from '@/lib/store';
   import { notFound, useParams } from 'next/navigation';

   export default function ProductPage() {
     const { id } = useParams<{ id: string }>();
     const product = products.find((p) => p.id === parseInt(id));
     const variants = productVariants.filter((v) => v.product_id === parseInt(id));
     const { addItem } = useCartStore();

     if (!product) {
       notFound();
     }

     return (
       <main className="container mx-auto p-4">
         <Card className="max-w-md mx-auto md:max-w-3xl lg:max-w-5xl">
           <CardHeader className="p-0">
             <div className="relative w-full h-64">
               <Image
                 src={product.image_url}
                 alt={product.name}
                 fill
                 className="object-cover rounded-t-md"
                 priority
               />
             </div>
           </CardHeader>
           <CardContent className="p-4">
             <h1 className="text-xl font-bold mb-2">{product.name}</h1>
             <p className="text-gray-500 text-sm mb-4">{product.description}</p>
             <p className="text-lg font-bold mb-4">NPR {product.base_price}</p>
             {variants.length > 0 && (
               <div className="mb-4">
                 <h3 className="text-sm font-semibold">Variants</h3>
                 <div className="flex gap-2 flex-wrap mt-2">
                   {variants.map((variant) => (
                     <Button
                       key={variant.id}
                       variant="outline"
                       size="sm"
                       className="text-xs"
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
               className="w-full"
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