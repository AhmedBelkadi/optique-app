'use client';

import Image from 'next/image';
import { Category } from '@/features/categories/schema/categorySchema';
import EditCategoryModal from '@/components/features/categories/EditCategoryModal';
import DeleteCategoryModal from '@/components/features/categories/DeleteCategoryModal';

interface CategoryCardProps {
  category: Category;
  onCategoryChange?: () => void;
}

export default function CategoryCard({ category, onCategoryChange }: CategoryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Category Image */}
      <div className="relative h-48 bg-gray-100">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Category Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {category.name}
          </h3>
        </div>

        {category.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {category.description}
          </p>
        )}

        {/* Category Stats */}
        <div className="flex items-center text-xs text-gray-500 mb-4">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Created {new Date(category.createdAt).toLocaleDateString()}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex space-x-2">
            <EditCategoryModal 
              category={category} 
              onSuccess={onCategoryChange}
            />
            <DeleteCategoryModal 
              category={category} 
              onSuccess={onCategoryChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 