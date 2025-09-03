'use server';

import { revalidatePath } from 'next/cache';
import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { deleteHomeValue } from '../services/homeValuesService';
import { getAllHomeValues } from '../services/homeValuesService';
import { requirePermission } from '@/lib/auth/authorization';

export interface DeleteHomeValueState {
  success: boolean;
  error: string;
  data?: any[];
}

export async function deleteHomeValueAction(prevState: DeleteHomeValueState, 
  formData: FormData
): Promise<DeleteHomeValueState> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('home', 'delete');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    const id = formData.get('id') as string;
    
    if (!id) {
      return {
        success: false,
        error: 'Value ID is required for deletion.',
      };
    }

    const result = await deleteHomeValue(id);
    
    if (result.success) {
      revalidatePath('/admin');
      revalidatePath('/admin/content/home');
      revalidatePath('/');
      
      // Get updated list of home values
      const updatedValuesResult = await getAllHomeValues();
      const updatedValues = updatedValuesResult.success ? updatedValuesResult.data || [] : [];
      
      return {
        success: true,
        error: '',
        data: updatedValues,
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to delete home value',
      };
    }
  } catch (error) {
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        success: false,
        error: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.',
        fieldErrors: {}
      };
    }

    // Handle permission/authorization errors
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      // This is a redirect error, likely due to permission issues
      return {
        success: false,
        error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
        fieldErrors: {}
      };
    }

    console.error('Error in deleteHomeValueAction:', error);
    return { 
      success: false, 
      error: 'Une erreur est survenue lors de la suppression' 
    };
  }
}
