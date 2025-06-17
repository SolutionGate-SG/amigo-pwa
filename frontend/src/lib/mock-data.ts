export interface Product {
  id: number;
  name: string;
  description: string;
  base_price: number;
  stock: number;
  category_id: number;
  vendor_id: number;
  image_url: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  variant_name: string;
  variant_value: string;
  price_adjustment: number;
  stock: number;
}

export const categories: Category[] = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Clothing" },
  { id: 3, name: "Handicrafts" },
];

export const products: Product[] = [
  {
    id: 1,
    name: "Classic Leather Sneakers",
    description: "Premium leather sneakers designed for comfort and style.",
    base_price: 3500,
    stock: 15,
    category_id: 4,
    vendor_id: 1,
    image_url:
      "/images/icon-192.png",
  },
  {
    id: 2,
    name: "Running Shoes (Performance Series)",
    description:
      "Lightweight running shoes with excellent grip and durability.",
    base_price: 7000,
    stock: 20,
    category_id: 4,
    vendor_id: 2,
    image_url:
      "/images/icon-512.png",
  },
];

export const productVariants: ProductVariant[] = [
  {
    id: 1,
    product_id: 1,
    variant_name: "Color",
    variant_value: "Red",
    price_adjustment: 0,
    stock: 10,
  },
  {
    id: 2,
    product_id: 1,
    variant_name: "Color",
    variant_value: "Blue",
    price_adjustment: 50,
    stock: 10,
  },
];
