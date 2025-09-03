import { prisma } from '@/lib/prisma';
import { Product } from '@/features/products/schema/productSchema';

export interface GetPublicProductsOptions {
  search?: string;
  categoryIds?: string[];
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface GetPublicProductsResult {
  success: boolean;
  data?: Product[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  error?: string;
}

export async function getPublicProducts(options: GetPublicProductsOptions = {}): Promise<GetPublicProductsResult> {
  try {
    const { 
      search, 
      categoryIds, 
      brand, 
      minPrice, 
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12
    } = options;

    // Build where clause - only non-deleted products
    const whereClause: any = {
      isDeleted: false,
    };
    
    // Add search functionality
    if (search) {
      whereClause.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          reference: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }
    
    // Add category filter
    if (categoryIds && categoryIds.length > 0) {
      whereClause.categories = {
        some: {
          categoryId: {
            in: categoryIds,
          },
        },
      };
    }

    // Add brand filter
    if (brand) {
      whereClause.brand = {
        contains: brand,
        mode: 'insensitive',
      };
    }

    // Add price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.price = {};
      if (minPrice !== undefined) {
        whereClause.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        whereClause.price.lte = maxPrice;
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await prisma.product.count({
      where: whereClause,
    });

    const products = await prisma.product.findMany({
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
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

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
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
    };
  } catch (error) {
    console.error('Error fetching public products:', error);
    return {
      success: false,
      error: 'Failed to fetch products',
    };
  }
}
