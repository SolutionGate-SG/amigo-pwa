'use client'; // Essential for client-side hooks like useCartStore

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useCartStore } from '@/lib/store';

export default function CartPage() {
  const { items, removeItem, clearCart } = useCartStore();

  // Calculate the total price of all items in the cart
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-120px)] lg:grid-cols-4"> {/* Responsive padding and min-height */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">Your Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500 mb-4">Your cart is currently empty. Start shopping now!</p>
          <Button onClick={() => window.location.href = '/'}>Browse Products</Button> {/* Redirect to home */}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cart Items List */}
          <div className="md:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div
                key={`${item.productId}-${item.variantId || 'no-variant'}-${index}`} // More robust key for items
                className="flex items-center gap-4 p-4 border rounded-lg bg-white shadow-sm"
              >
                <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
                  <Image
                    src={item.image_url || `/images/placeholder-product.png`} // Use item.image_url, fallback to placeholder
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100px, 150px" // Optimized image loading
                    className="object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h2 className="text-base sm:text-lg font-semibold mb-1 text-gray-800">{item.name}</h2>
                  <p className="text-sm text-gray-600 mb-1">Quantity: {item.quantity}</p>
                  <p className="text-md font-bold text-blue-700">NPR {item.price.toFixed(2)}</p> {/* Format price */}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="px-3 py-1 text-sm font-medium"
                  onClick={() => removeItem(item.productId, item.variantId)} // Pass variantId for specific removal
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="md:col-span-1">
            <Card className="shadow-lg rounded-lg bg-white p-6 sticky top-24"> {/* Sticky for better visibility */}
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl font-bold text-gray-800">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex justify-between items-center mb-3 text-lg">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-bold text-gray-900">NPR {subtotal.toFixed(2)}</span>
                </div>
                {/* Add shipping, tax, etc., placeholders if needed */}
                <div className="border-t pt-4 mt-4">
                  <p className="text-xl font-extrabold text-green-700 flex justify-between items-center">
                    <span>Total:</span>
                    <span>NPR {subtotal.toFixed(2)}</span>
                  </p>
                </div>
                <div className="flex flex-col gap-3 mt-6">
                  <Button className="w-full py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-colors" disabled>
                    Proceed to Checkout (Coming Soon)
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full py-3 text-lg font-semibold border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </main>
  );
}