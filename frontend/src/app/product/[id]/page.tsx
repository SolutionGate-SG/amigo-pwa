// app/product/[id]/page.tsx
import { getProduct } from "@/lib/products";
import ProductDetails from "@/components/product-details";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Await the params Promise
  const product = await getProduct(id);
  return <ProductDetails product={product} />;
}