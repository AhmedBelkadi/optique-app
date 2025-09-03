import { prisma } from '@/lib/prisma';
import { Product } from '../schema/productSchema';

export interface GetFeaturedProductsResult {
  success: boolean;
  data?: Product[];
  error?: string;
}

export async function getFeaturedProducts(limit: number = 6): Promise<GetFeaturedProductsResult> {
  try {
    const products = await prisma.product.findMany({
      where: {
        isDeleted: false,
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
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    // Transform the data to match our schema
    const transformedProducts: Product[] = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      brand: product.brand,
      reference: product.reference,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      deletedAt: product.deletedAt,
      isDeleted: product.isDeleted,
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

    return {
      success: true,
      data: transformedProducts,
    };
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return {
      success: false,
      error: 'Failed to fetch featured products',
    };
  }
}
