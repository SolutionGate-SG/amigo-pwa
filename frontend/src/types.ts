export interface User {
  id: string;
  email: string;
  [key: string]: any; // Allow additional properties from Supabase user
}

export interface Order {
  id: string;
  total: number;
  status: string;
  order_details: {
    id: string;
    product_id: string;
    quantity: number;
    price: number;
    address: string;
    product: {
      name: string;
      product_img: string;
    };
  }[];
}
