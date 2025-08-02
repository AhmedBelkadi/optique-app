'use server';

import { createProduct } from '@/features/products/services/createProduct';
import { saveImage, generateImageAlt } from '@/lib/shared/utils/serverImageUpload';
import { prisma } from '@/lib/prisma';
import { CreateProductState } from '@/types/api';


export async function createProductAction(prevState: CreateProductState, formData: FormData): Promise<CreateProductState> {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = formData.get('price') as string;
  const brand = formData.get('brand') as string;
  const reference = formData.get('reference') as string;
  const categoryIds = formData.getAll('categoryIds') as string[];

  try {
    // Create the product first
    const result = await createProduct({
      name,
      description,
      price: parseFloat(price),
      brand: brand || undefined,
      reference: reference || undefined,
      categoryIds,
    });

    if (result.success && result.data) {
      // Handle image uploads if any
      const imageFiles = formData.getAll('images') as File[];
      if (imageFiles.length > 0) {
        // Save images and create ProductImage records
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          if (file && file.size > 0) {
            try {
              const imageResult = await saveImage(file, result.data.id, i);
              
              // Create ProductImage record in database
              await prisma.productImage.create({
                data: {
                  productId: result.data.id,
                  filename: imageResult.filename,
                  path: imageResult.path,
                  alt: generateImageAlt(result.data.name, i),
                  order: i,
                },
              });
            } catch (error) {
              console.error('Error saving product image:', error);
              // Continue even if image upload fails
            }
          }
        }
      }

      return {
        error: '',
        fieldErrors: {},
        values: {
          name: '',
          description: '',
          price: '',
          brand: '',
          reference: '',
          categoryIds: [],
        },
        success: true,
        productId: result.data.id,
      };
    } else {
      return {
        error: result.error || 'Failed to create product',
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
    console.error('Create product action error:', error);
    return {
      error: 'An unexpected error occurred while creating the product',
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