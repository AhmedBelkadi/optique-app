'use server';

import { requirePermission } from '@/lib/auth/authorization';
import { getAllTestimonials } from '@/features/testimonials/services/getAllTestimonials';

export async function getAllTestimonialsAction(params?: {
  page?: number;
  limit?: number;
  search?: string;
  source?: 'internal' | 'facebook' | 'google' | 'trustpilot';
  isActive?: boolean;
  isVerified?: boolean;
  isDeleted?: boolean;
}) {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('testimonials', 'read');

    // Get testimonials with optional filtering
    const result = await getAllTestimonials({
      page: params?.page || 1,
      limit: params?.limit || 10,
      search: params?.search,
      source: params?.source,
      isActive: params?.isActive,
      isVerified: params?.isVerified,
      isDeleted: params?.isDeleted,
    });

    if (result.success) {
      return {
        success: true,
        data: result.data,
        pagination: result.pagination,
      };
    } else {
      return {
        success: false,
        error: result.error || 'Échec de la récupération des témoignages',
      };
    }
  } catch (error) {
    console.error('Error in getAllTestimonialsAction:', error);
    
    // Handle permission/authorization errors
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      // This is a redirect error, likely due to permission issues
      return {
        success: false,
        error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
      };
    }
    
    return {
      success: false,
      error: 'Une erreur inattendue est survenue lors de la récupération des témoignages',
    };
  }
}