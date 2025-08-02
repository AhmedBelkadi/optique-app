'use server';

import { updateProduct } from '@/features/products/services/updateProduct';
import { UpdateProductState } from '@/types/api';



export async function updateProductAction(prevState: UpdateProductState, formData: FormData): Promise<UpdateProductState> {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = formData.get('price') as string;
  const brand = formData.get('brand') as string;
  const reference = formData.get('reference') as string;
  const categoryIds = formData.getAll('categoryIds') as string[];
  const keepImageIds = formData.getAll('keepImageIds') as string[];
  const newImages: File[] = [];
  formData.forEach((value, key) => {
    if (key === 'images' && value instanceof File) {
      newImages.push(value);
    }
  });

  if (!id) {
    return {
      error: 'Product ID is required',
    };
  }

  try {
    const result = await updateProduct(id, {
      name,
      description,
      price: parseFloat(price),
      brand: brand || undefined,
      reference: reference || undefined,
      categoryIds,
      keepImageIds,
      newImages,
    });

    if (result.success) {
      return {
        error: '',
        fieldErrors: {},
        values: {
          name,
          description,
          price,
          brand,
          reference,
          categoryIds,
        },
        success: true,
      };
    } else {
      return {
        error: result.error || 'Failed to update product',
        fieldErrors: result.fieldErrors,
        values: {
          name,
          description,
          price,
          brand,
          reference,
          categoryIds,
        },
      };
    }
  } catch (error) {
    console.error('Update product action error:', error);
    return {
      error: 'An unexpected error occurred while updating the product',
      fieldErrors: {},
      values: {
        name,
        description,
        price,
        brand,
        reference,
        categoryIds,
      },
    };
  }
} 