'use client';

import { Category } from '@/features/categories/schema/categorySchema';
import CategoryCard from './CategoryCard';

interface CategoryGridProps {
  categories: Category[];
  viewMode: 'grid' | 'list';
  onCategoryUpdated: (category: Category) => void;
  onCategoryDeleted: (id: string) => void;
}

export default function CategoryGrid({
  categories,
  viewMode,
  onCategoryUpdated,
  onCategoryDeleted,
}: CategoryGridProps) {
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            viewMode="list"
            onCategoryUpdated={onCategoryUpdated}
            onCategoryDeleted={onCategoryDeleted}
          />
        ))}
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          viewMode="grid"
          onCategoryUpdated={onCategoryUpdated}
          onCategoryDeleted={onCategoryDeleted}
        />
      ))}
    </div>
  );
}
