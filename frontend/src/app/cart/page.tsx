'use client';

import { Button } from '@/components/ui/button';
     import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
     import { useCartStore } from '@/lib/store';

     export default function CartPage() {
       const { items, removeItem, clearCart } = useCartStore();

       const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

       return (
         <main className="container mx-auto p-4">
           <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
           {items.length === 0 ? (
             <p>Your cart is empty.</p>
           ) : (
             <Card>
               <CardHeader>
                 <CardTitle>Cart Items</CardTitle>
               </CardHeader>
               <CardContent>
                 <ul className="space-y-4">
                   {items.map((item, index) => (
                     <li key={`${item.productId}-${item.variantId || index}`} className="flex justify-between">
                       <span>{item.name} (x{item.quantity})</span>
                       <div className="flex gap-2">
                         <span>NPR {item.price}</span>
                         <Button
                           variant="destructive"
                           size="sm"
                           onClick={() => removeItem(item.productId, item.variantId)}
                         >
                           Remove
                         </Button>
                       </div>
                     </li>
                   ))}
                 </ul>
                 <div className="mt-6">
                   <p className="text-lg font-bold">Total: NPR {total}</p>
                   <div className="flex gap-2 mt-4">
                     <Button onClick={clearCart}>Clear Cart</Button>
                     <Button disabled>Checkout (Coming Soon)</Button>
                   </div>
                 </div>
               </CardContent>
             </Card>
           )}
         </main>
       );
     }