import { notFound } from 'next/navigation';
import { getProductById } from '@/features/products/queries/getProductById';
import { getAllCategories } from '@/features/categories/services/getAllCategories';
import EditProductForm from './EditProductForm';

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  
  // Fetch product and categories in parallel
  const [productResult, categoriesResult] = await Promise.all([
    getProductById(id),
    getAllCategories(),
  ]);
  
  if (!productResult.success || !productResult.data) {
    notFound();
  }

  const categories = categoriesResult.success ? categoriesResult.data || [] : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <EditProductForm product={productResult.data} categories={categories} />
      </div>
    </div>
  );
} 