'use server';

import { revalidatePath } from 'next/cache';
import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { updateHomeValue } from '../services/homeValuesService';
import { HomeValuesFormData, homeValuesFormSchema } from '../schema/homeValuesSchema';
import { logError } from '@/lib/errorHandling';
import { getAllHomeValues } from '../services/homeValuesService';
import { requirePermission } from '@/lib/auth/authorization';

export interface UpdateHomeValueState {
  success: boolean;
  error: string;
  fieldErrors: Record<string, string[]>;
  values: Partial<HomeValuesFormData>;
  valueId: string;
  data?: any[];
}

export async function updateHomeValueAction(prevState: UpdateHomeValueState, 
  formData: FormData
): Promise<UpdateHomeValueState> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('home', 'update');

    // Safety check for formData
    if (!formData || typeof formData.get !== 'function') {
      return {
        success: false,
        error: 'Invalid form data provided.',
        fieldErrors: {},
        values: getDefaultValues(),
        valueId: '',
      };
    }

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    // Extract and validate form data
    const formValues = extractFormValues(formData);
    const id = formData.get('id') as string;
    
    if (!id) {
      return {
        success: false,
        error: 'Value ID is required for update.',
        fieldErrors: {},
        values: formValues,
        valueId: '',
      };
    }

    const validation = homeValuesFormSchema.partial().safeParse(formValues);
    if (!validation.success) {
      return {
        success: false,
        error: 'Validation failed. Please check your input.',
        fieldErrors: validation.error.flatten().fieldErrors,
        values: formValues,
        valueId: id,
      };
    }

    const result = await updateHomeValue(id, validation.data);
    
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
        fieldErrors: {},
        values: getDefaultValues(),
        valueId: id,
        data: updatedValues,
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to update home value',
        fieldErrors: result.fieldErrors || {},
        values: formValues,
        valueId: id,
      };
    }
  } catch (error) {
    // Handle rate limiting errors
    if (error instanceof Error && error.name === 'RateLimitError') {
      return {
        success: false,
        error: error.message,
        fieldErrors: {},
        values: extractFormValues(formData),
        valueId: formData.get('id') as string || '',
      };
    }
    
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        success: false,
        error: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.',
        fieldErrors: {},
        values: getDefaultValues(),
        valueId: '',
      };
    }

    // Handle permission/authorization errors
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      // This is a redirect error, likely due to permission issues
      return {
        success: false,
        error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
        fieldErrors: {},
        values: getDefaultValues(),
        valueId: '',
      };
    }

    // Log and handle other errors
    logError(error as Error, { 
      action: 'updateHomeValue',
      formData: extractFormValues(formData)
    });
    
    return {
      success: false,
      error: 'An unexpected error occurred while updating home value. Please try again.',
      fieldErrors: {},
      values: extractFormValues(formData),
      valueId: formData.get('id') as string || '',
    };
  }
}

function extractFormValues(formData: FormData): Partial<HomeValuesFormData> {
  return {
    title: formData.get('title') as string || undefined,
    description: formData.get('description') as string || undefined,
    highlight: formData.get('highlight') as string || undefined,
    icon: formData.get('icon') as string || undefined,
    order: formData.get('order') ? parseInt(formData.get('order') as string) : undefined,
  };
}

function getDefaultValues(): Partial<HomeValuesFormData> {
  return {
    title: '',
    description: '',
    highlight: '',
    icon: '',
    order: 0,
  };
}
