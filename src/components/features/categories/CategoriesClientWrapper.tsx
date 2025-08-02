'use client';

import { useRouter } from 'next/navigation';
import CreateCategoryModal from '@/components/features/categories/CreateCategoryModal';
import CategoryCard from './CategoryCard';
import { Category } from '@/features/categories/schema/categorySchema';

interface CategoriesClientWrapperProps {
  categories: Category[];
}

export default function CategoriesClientWrapper({ categories }: CategoriesClientWrapperProps) {
  const router = useRouter();

  const handleCategoryChange = () => {
    // Force a complete page refresh to ensure cache invalidation
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="mt-2 text-gray-600">
              Manage your product categories and organize your inventory
            </p>
          </div>
          <CreateCategoryModal onSuccess={handleCategoryChange} />
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                onCategoryChange={handleCategoryChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 