'use server';

import { softDeleteProduct } from '@/features/products/services/softDeleteProduct';

export async function deleteProductAction(prevState: any, formData: FormData) {
  try {
    const productId = formData.get('productId') as string;
    
    const result = await softDeleteProduct(productId);
    
    if (result.success) {
      return {
        error: '',
        success: true,
      };
    } else {
      return {
        error: result.error || 'Failed to delete product',
        success: false,
      };
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    return {
      error: 'An unexpected error occurred',
      success: false,
    };
  }
} 