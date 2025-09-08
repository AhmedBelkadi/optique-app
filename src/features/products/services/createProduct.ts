import { prisma } from '@/lib/prisma';
import { CreateProductInput, Product } from '../schema/productSchema';
import { productSchema } from '../schema/productSchema';
import { validateAndSanitizeProduct } from '@/lib/shared/utils/sanitize';
import { createError, ErrorCode, logError } from '@/lib/errorHandling';

export interface CreateProductResult {
  success: boolean;
  data?: Product;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function createProduct(productData: CreateProductInput): Promise<CreateProductResult> {
  try {
    // Sanitize input first
    const sanitizedData = validateAndSanitizeProduct(productData);
    
    // Validate sanitized input
    const validation = productSchema.create.safeParse(sanitizedData);
    if (!validation.success) {
      return {
        success: false,
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    const { categoryIds, ...productFields } = validation.data;

    const product = await prisma.$transaction(async (tx) => {
      return await tx.product.create({
        data: {
          ...productFields,
          categories: {
            create: categoryIds.map(categoryId => ({
              categoryId,
            })),
          },
        },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          images: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      });
    });

    // Transform the data to match our schema
    const transformedProduct: Product = {
      ...product,
      categories: product.categories.map(pc => ({
        id: pc.category.id,
        name: pc.category.name,
        description: pc.category.description,
      })),
      images: product.images.map(img => ({
        id: img.id,
        filename: img.filename,
        path: img.path,
        alt: img.alt,
        order: img.order,
      })),
    };

    return {
      success: true,
      data: transformedProduct,
    };
  } catch (error) {
    logError(error as Error, { 
      action: 'createProduct', 
      productData: { 
        name: productData.name,
        price: productData.price,
        categoryIds: productData.categoryIds 
      } 
    });
    
    // Check for specific database errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return {
          success: false,
          error: 'Un produit avec cette référence existe déjà.',
        };
      }
      
      if (error.message.includes('Foreign key constraint')) {
        return {
          success: false,
          error: 'Une ou plusieurs catégories sélectionnées n\'existent pas.',
        };
      }
    }
    
    return {
      success: false,
              error: 'Échec de la création du produit. Veuillez réessayer.',
    };
  }
} 