'use server';

import { deleteCategory } from '@/features/categories/services/deleteCategory';
import { CategoryActionState } from '@/types/api';
import { revalidateTag } from 'next/cache';


export async function deleteCategoryAction(prevState: CategoryActionState, formData: FormData): Promise<CategoryActionState> {
  try {
    const categoryId = formData.get('categoryId') as string;
    
    const result = await deleteCategory(categoryId);
    
    if (result.success) {
      // Invalidate cache to refresh the UI
      revalidateTag('categories');
      
      return {
        error: '',
        success: true,
      };
    } else {
      return {
        error: result.error || 'Failed to delete category',
        success: false,
      };
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    return {
      error: 'An unexpected error occurred',
      success: false,
    };
  }
} 