import { prisma } from '@/lib/prisma';
import { Product } from '../schema/productSchema';
import { sanitizeString } from '@/lib/shared/utils/sanitize';

export interface GetProductByIdResult {
  success: boolean;
  data?: Product;
  error?: string;
}

export interface GetProductByIdOptions {
  includeDeleted?: boolean;
}

export async function getProductById(id: string, options: GetProductByIdOptions = {}): Promise<GetProductByIdResult> {
  try {
    // Sanitize the ID input
    const sanitizedId = sanitizeString(id);
    
    if (!sanitizedId) {
      return { success: false, error: 'Invalid product ID' };
    }

    const { includeDeleted = false } = options;
    const whereClause = includeDeleted ? { id: sanitizedId } : { id: sanitizedId, isDeleted: false };
    
    const product = await prisma.product.findUnique({
      where: whereClause,
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

    if (!product) {
      return {
        success: false,
        error: 'Product not found',
      };
    }

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
    console.error('Error fetching product by ID:', error);
    return {
      success: false,
      error: 'Failed to fetch product',
    };
  }
} 