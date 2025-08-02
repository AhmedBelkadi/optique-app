'use server';

import { deleteProduct } from '@/features/products/services/deleteProduct';
import { DeleteProductState } from '@/types/api';


export async function deleteProductAction(prevState: DeleteProductState, formData: FormData): Promise<DeleteProductState> {
  const id = formData.get('id') as string;

  if (!id) {
    return {
      success: false,
      error: 'Product ID is required',
    };
  }

  try {
    const result = await deleteProduct(id);

    if (result.success) {
      return {
        success: true,
        error: '',
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to delete product',
      };
    }
  } catch (error) {
    console.error('Delete product action error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while deleting the product',
    };
  }
} 