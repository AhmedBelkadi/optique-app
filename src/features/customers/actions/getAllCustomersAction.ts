'use server';

import { getCurrentUser } from '@/features/auth/services/session';
import { requirePermission } from '@/lib/auth/authorization';
import { getAllCustomers } from '@/features/customers/services/getAllCustomers';
import { logError } from '@/lib/errorHandling';

interface GetAllCustomersParams {
  search?: string;
  isDeleted?: boolean;
  sortBy?: 'name' | 'email' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export async function getAllCustomersAction(params: GetAllCustomersParams = {}) {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('customers', 'read');

    // Check authentication
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        error: 'Authentification requise. Veuillez vous connecter.',
      };
    }

    // Get all customers with parameters
    const result = await getAllCustomers(params);

    if (result.success && result.data) {
      return {
        success: true,
        data: result.data,
        pagination: result.pagination
      };
    } else {
      return {
        success: false,
        error: result.error || 'Échec de la récupération des clients'
      };
    }
  } catch (error) {
    // Log and handle errors
    logError(error as Error, { 
      action: 'getAllCustomers',
      params
    });
    
    return {
      success: false,
      error: 'Une erreur inattendue est survenue lors de la récupération des clients. Veuillez réessayer.'
    };
  }
}