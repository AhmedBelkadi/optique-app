import ProductForm from '../../../components/features/products/ProductForm';
import { getAllCategories } from '@/features/categories/services/getAllCategories';

export default async function NewProductPage() {
  // Fetch categories for the form
  const categoriesResult = await getAllCategories();
  const categories = categoriesResult.success ? categoriesResult.data || [] : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductForm mode="create" categories={categories} />
      </div>
    </div>
  );
} 