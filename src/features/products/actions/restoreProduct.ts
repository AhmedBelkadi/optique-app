'use server';

import { restoreProduct } from '@/features/products/services/restoreProduct';
import { RestoreProductState } from '@/types/api';



export async function restoreProductAction(prevState: RestoreProductState, formData: FormData): Promise<RestoreProductState> {
  const id = formData.get('id') as string;

  if (!id) {
    return {
      success: false,
      error: 'Product ID is required',
    };
  }

  try {
    const result = await restoreProduct(id);

    if (result.success) {
      return {
        success: true,
        error: '',
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to restore product',
      };
    }
  } catch (error) {
    console.error('Restore product action error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while restoring the product',
    };
  }
} 