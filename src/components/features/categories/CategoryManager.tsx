'use client';

import { useEffect, useRef } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import { createCategoryAction } from '@/features/categories/actions/createCategory';

interface CategoryManagerProps {
  onSuccess?: () => void;
}

export default function CategoryManager({ onSuccess }: CategoryManagerProps) {
  const previousIsPending = useRef(false);

  const [state, formAction, isPending] = useActionState(createCategoryAction, {
    success: false,
    error: '',
    fieldErrors: {},
    values: {
      name: '',
      description: '',
    },
  });

  // Handle create success/error
  useEffect(() => {
    if (previousIsPending.current && !isPending) {
      if (state.success) {
        toast.success('Category created successfully!');
        onSuccess?.();
      } else if (state.error) {
        toast.error(state.error || 'Failed to create category');
      }
    }
    previousIsPending.current = isPending;
  }, [isPending, state.success, state.error, onSuccess]);

  const handleSubmit = (formData: FormData) => {
    formAction(formData);
  };

  return (
    <div className="bg-background rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Create Category</h2>
      
      <form action={handleSubmit} className="space-y-4">
        {/* Category Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground">
            Category Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={state.values?.name || ''}
            className="mt-1 block w-full rounded-md border-border shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="Enter category name"
          />
          {state.fieldErrors?.name && (
            <p className="mt-1 text-sm text-destructive">{state.fieldErrors.name}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={state.values?.description || ''}
            className="mt-1 block w-full rounded-md border-border shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="Enter category description"
          />
          {state.fieldErrors?.description && (
            <p className="mt-1 text-sm text-destructive">{state.fieldErrors.description}</p>
          )}
        </div>

        {/* Error Display */}
        {state.error && (
          <div className="text-destructive text-sm text-center bg-destructive/5 p-3 rounded-md">
            {state.error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {isPending ? 'Creating...' : 'Create Category'}
          </button>
        </div>
      </form>
    </div>
  );
} 