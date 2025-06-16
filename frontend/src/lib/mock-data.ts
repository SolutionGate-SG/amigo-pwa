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
       { id: 1, name: 'Electronics' },
       { id: 2, name: 'Clothing' },
       { id: 3, name: 'Handicrafts' },
     ];

     export const products: Product[] = [
       {
         id: 1,
         name: 'Handwoven Dhaka Topi',
         description: 'Traditional Nepali cap, handwoven with vibrant patterns.',
         base_price: 500,
         stock: 20,
         category_id: 3,
         vendor_id: 1,
         image_url: 'https://via.placeholder.com/300x200.png?text=Dhaka+Topi',
       },
       {
         id: 2,
         name: 'Smartphone (Budget)',
         description: 'Affordable smartphone for Nepal’s market.',
         base_price: 15000,
         stock: 10,
         category_id: 1,
         vendor_id: 2,
         image_url: 'https://via.placeholder.com/300x200.png?text=Smartphone',
       },
     ];

     export const productVariants: ProductVariant[] = [
       {
         id: 1,
         product_id: 1,
         variant_name: 'Color',
         variant_value: 'Red',
         price_adjustment: 0,
         stock: 10,
       },
       {
         id: 2,
         product_id: 1,
         variant_name: 'Color',
         variant_value: 'Blue',
         price_adjustment: 50,
         stock: 10,
       },
     ];