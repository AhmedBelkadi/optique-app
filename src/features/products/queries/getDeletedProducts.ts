import { prisma } from '@/lib/prisma';
import { Product } from '../schema/productSchema';

export interface GetDeletedProductsResult {
  success: boolean;
  data?: Product[];
  error?: string;
}

export async function getDeletedProducts(): Promise<GetDeletedProductsResult> {
  try {
    const products = await prisma.product.findMany({
      where: { isDeleted: true },
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
      orderBy: { deletedAt: 'desc' },
    });

    // Transform the data to match our schema
    const transformedProducts: Product[] = products.map(product => ({
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
    }));

    return { success: true, data: transformedProducts };
  } catch (error) {
    console.error('Error fetching deleted products:', error);
    return { success: false, error: 'Failed to fetch deleted products' };
  }
} 