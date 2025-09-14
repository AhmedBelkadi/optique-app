'use server';

import { requirePermission } from '@/lib/auth/authorization';
import { getAllProducts } from '../queries/getAllProducts';
import { logError } from '@/lib/errorHandling';

interface ProductFilters {
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

export async function getAllProductsAction(filters?: ProductFilters) {
  try {
    // 🔐 AUTHENTICATION CHECK - Ensure user has permission
    await requirePermission('products', 'read');

    return await getAllProducts(filters);
  } catch (error) {
    logError(error as Error, { context: 'getAllProductsAction', filters });
    return {
      success: false,
      error: 'Erreur lors de la récupération des produits'
    };
  }
}
