'use client';

import { Button } from '@/components/ui/button';
     import Link from 'next/link';
     import { useCartStore } from '@/lib/store';

     export default function Navbar() {
       const { items } = useCartStore();

       return (
         <nav className="bg-gray-800 text-white p-4">
           <div className="container mx-auto flex justify-between items-center">
             <Link href="/" className="text-xl font-bold">
               Amigo eStore
             </Link>
             <div className="flex gap-4">
               <Link href="/cart">
                 <Button variant="secondary">
                   Cart ({items.length})
                 </Button>
               </Link>
             </div>
           </div>
         </nav>
       );
     }