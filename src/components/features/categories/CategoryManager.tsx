'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { createCategoryAction } from '@/features/categories/actions/createCategory';

interface Category {
  id: string;
  name: string;
  description?: string | null;
}

interface CategoryManagerProps {
  categories: Category[];
  selectedCategoryIds: string[];
  onCategoryChange: (categoryIds: string[]) => void;
}

export default function CategoryManager({ 
  categories, 
  selectedCategoryIds, 
  onCategoryChange 
}: CategoryManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const [state, formAction, isPending] = useActionState(createCategoryAction, {
    error: '',
    fieldErrors: {},
    values: {
      name: '',
      description: '',
    },
  });

  const handleCategoryToggle = (categoryId: string) => {
    const newSelection = selectedCategoryIds.includes(categoryId)
      ? selectedCategoryIds.filter(id => id !== categoryId)
      : [...selectedCategoryIds, categoryId];
    onCategoryChange(newSelection);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Categories *
        </label>
        <button
          type="button"
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          {showCreateForm ? 'Cancel' : '+ Add New Category'}
        </button>
      </div>

      {/* Create Category Form */}
      {showCreateForm && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                id="categoryName"
                name="name"
                required
                defaultValue={state.values?.name || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter category name"
              />
              {state.fieldErrors?.name && (
                <p className="mt-1 text-sm text-red-600">{state.fieldErrors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="categoryDescription"
                name="description"
                rows={2}
                defaultValue={state.values?.description || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter category description"
              />
              {state.fieldErrors?.description && (
                <p className="mt-1 text-sm text-red-600">{state.fieldErrors.description}</p>
              )}
            </div>

            {state.error && (
              <div className="text-red-600 text-sm">{state.error}</div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {isPending ? 'Creating...' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Selection */}
      <div className="space-y-2">
        {categories.length === 0 ? (
          <p className="text-sm text-gray-500">No categories available. Create one above.</p>
        ) : (
          categories.map((category) => (
            <label key={category.id} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategoryIds.includes(category.id)}
                onChange={() => handleCategoryToggle(category.id)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
                {category.description && (
                  <p className="text-xs text-gray-500">{category.description}</p>
                )}
              </div>
            </label>
          ))
        )}
      </div>

      {selectedCategoryIds.length === 0 && (
        <p className="text-sm text-red-600">Please select at least one category.</p>
      )}
    </div>
  );
} 