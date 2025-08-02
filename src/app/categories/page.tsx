import { getAllCategories } from '@/features/categories/services/getAllCategories';
import CategoriesClientWrapper from '@/components/features/categories/CategoriesClientWrapper';

export default async function CategoriesPage() {
  // Fetch categories
  const categoriesResult = await getAllCategories();
  const categories = categoriesResult.success ? categoriesResult.data || [] : [];

  return <CategoriesClientWrapper categories={categories} />;
} 