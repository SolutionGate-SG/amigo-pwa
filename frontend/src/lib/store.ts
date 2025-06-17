import { create } from 'zustand';

// Define the structure for a single item in the cart
type CartItem = {
  productId: number;
  variantId?: number; // Optional: for products with multiple variations (e.g., size, color)
  quantity: number;
  price: number;
  name: string;
  image_url?: string; // Optional: for displaying images in the cart
};

// Define the shape of your cart's state and available actions
type CartState = {
  items: CartItem[]; // Array of items currently in the cart
  addItem: (item: CartItem) => void; // Function to add an item to the cart
  removeItem: (productId: number, variantId?: number) => void; // Function to remove an item, optionally by variant
  clearCart: () => void; // Function to empty the entire cart
  // Optional: You could add updateQuantity, getTotalPrice, etc. here
};

export const useCartStore = create<CartState>((set) => ({
  // Initial state: an empty array of items
  items: [],

  // Action to add an item to the cart
  addItem: (newItem) =>
    set((state) => {
      // Check if the item (and its variant, if applicable) already exists in the cart
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          (newItem.variantId ? item.variantId === newItem.variantId : !item.variantId)
      );

      if (existingItemIndex > -1) {
        // If item exists, update its quantity
        const updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
        return { items: updatedItems };
      } else {
        // If item doesn't exist, add it as a new item
        return { items: [...state.items, newItem] };
      }
    }),

  // Action to remove an item from the cart
  removeItem: (productId, variantId) =>
    set((state) => ({
      items: state.items.filter(
        (item) =>
          // Keep items that don't match the productId
          item.productId !== productId ||
          // Or, if a variantId is provided, keep items that don't match that specific variant
          (variantId !== undefined && item.variantId !== variantId)
          // If variantId is undefined, it means we remove all instances of that productId
      ),
    })),

  // Action to clear the entire cart
  clearCart: () => set({ items: [] }),
}));