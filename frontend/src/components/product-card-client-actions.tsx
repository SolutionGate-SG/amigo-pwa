// src/components/product-card-client-actions.tsx
'use client'; // This directive is CRUCIAL to make this a Client Component

import { Button } from '@/components/ui/button'; // Assuming Button component is also 'use client'
import { useCartStore } from '@/lib/store'; // Your Zustand store
import Link from 'next/link'; // Next.js Link can be used in Client Components

// Define the props this component will receive from its parent (the Server Component)
interface ProductCardClientActionsProps {
  productId: number;
  productName: string;
  productPrice: number;
}

export default function ProductCardClientActions({
  productId,
  productName,
  productPrice,
}: ProductCardClientActionsProps) {
  // Use the Zustand hook here, as this is a Client Component
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      productId: productId,
      quantity: 1, // Assuming default quantity is 1
      price: productPrice,
      name: productName,
      image_url: '', // You can pass an image URL if available, or leave it empty
    });
    // Optional: Add a simple alert or toast notification for user feedback
    alert(`${productName} added to cart!`);
  };

  return (
    <div className="flex gap-1 mt-2">
      {/* Link is fine here, it's a client-side navigation component */}
      <Link href={`/product/${productId}`}>
        <Button variant="outline" size="sm" className="text-xs md:text-sm">
          View
        </Button>
      </Link>
      <Button
        size="sm"
        className="text-xs md:text-sm"
        onClick={handleAddToCart} // The onClick handler is defined and used within this Client Component
      >
        Add
      </Button>
    </div>
  );
}