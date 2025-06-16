import create from 'zustand';

     interface CartItem {
       productId: number;
       variantId?: number;
       quantity: number;
       price: number;
       name: string;
     }

     interface CartState {
       items: CartItem[];
       addItem: (item: CartItem) => void;
       removeItem: (productId: number, variantId?: number) => void;
       clearCart: () => void;
     }

     export const useCartStore = create<CartState>((set) => ({
       items: [],
       addItem: (item) =>
         set((state) => ({
           items: [...state.items, item],
         })),
       removeItem: (productId, variantId) =>
         set((state) => ({
           items: state.items.filter(
             (item) =>
               item.productId !== productId ||
               (variantId && item.variantId !== variantId)
           ),
         })),
       clearCart: () => set({ items: [] }),
     }));