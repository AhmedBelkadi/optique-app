import { prisma } from '@/lib/prisma';
import { Product } from '../schema/productSchema';
import { sanitizeString } from '@/lib/shared/utils/sanitize';

export interface GetAllProductsResult {
  success: boolean;
  data?: Product[];
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface GetAllProductsOptions {
  includeDeleted?: boolean;
  search?: string;
  categoryIds?: string[];
  brand?: string;
  reference?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'createdAt' | 'brand';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export async function getAllProducts(options: GetAllProductsOptions = {}): Promise<GetAllProductsResult> {
  try {
    const { 
      includeDeleted = false, 
      search, 
      categoryIds, 
      brand, 
      reference, 
      minPrice, 
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12
    } = options;

    // Build where clause
    const whereClause: any = {};
    
    // Filter by deletion status
    if (!includeDeleted) {
      whereClause.isDeleted = false;
    }
    
    // Add search functionality
    if (search) {
      const sanitizedSearch = sanitizeString(search);
      if (sanitizedSearch) {
        whereClause.OR = [
          {
            name: {
              contains: sanitizedSearch,
              mode: 'insensitive', // Case-insensitive search
            },
          },
          {
            description: {
              contains: sanitizedSearch,
              mode: 'insensitive',
            },
          },
          {
            reference: {
              contains: sanitizedSearch,
              mode: 'insensitive',
            },
          },
        ];
      }
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
      const sanitizedBrand = sanitizeString(brand);
      if (sanitizedBrand) {
        whereClause.brand = {
          contains: sanitizedBrand,
          mode: 'insensitive',
        };
      }
    }

    // Add reference filter
    if (reference) {
      const sanitizedReference = sanitizeString(reference);
      if (sanitizedReference) {
        whereClause.reference = {
          contains: sanitizedReference,
          mode: 'insensitive',
        };
      }
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
    return {
      success: true,
      data: products.map(product => ({
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
      })),
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
    console.error('Error fetching products:', error);
    return {
      success: false,
      error: 'Failed to fetch products',
    };
  }
} 