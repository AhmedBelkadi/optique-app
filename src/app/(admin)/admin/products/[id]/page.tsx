import { notFound } from 'next/navigation';
import { getProductById } from '@/features/products/queries/getProductById';
import ProductDetails from '@/components/features/products/ProductDetails';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const result = await getProductById(id);
  
  if (!result.success || !result.data) {
    notFound();
  }

  const product = result.data;

  return <ProductDetails product={product} />;
} 