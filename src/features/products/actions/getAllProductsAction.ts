'use server';

import { requirePermission } from '@/lib/auth/authorization';
import { getAllProducts } from '../queries/getAllProducts';

export async function getAllProductsAction(filters?: any) {
  try {
    // 🔐 AUTHENTICATION CHECK - Ensure user has permission
    requirePermission('products', 'read');

    return await getAllProducts(filters);
  } catch (error) {
    console.error('Error in getAllProductsAction:', error);
    return {
      success: false,
      error: 'Erreur lors de la récupération des produits'
    };
  }
}
