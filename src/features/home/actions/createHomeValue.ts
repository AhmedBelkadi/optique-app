'use server';

import { revalidatePath } from 'next/cache';
import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { createHomeValue } from '../services/homeValuesService';
import { HomeValuesFormData, homeValuesFormSchema } from '../schema/homeValuesSchema';
import { logError } from '@/lib/errorHandling';
import { getAllHomeValues } from '../services/homeValuesService';
import { requirePermission } from '@/lib/auth/authorization';

export interface CreateHomeValueState {
  success: boolean;
  error: string;
  fieldErrors: Record<string, string[]>;
  values: HomeValuesFormData;
  valueId: string;
  data?: any[];
}

export async function createHomeValueAction(
  prevState: CreateHomeValueState, 
  formData: FormData
): Promise<CreateHomeValueState> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('home', 'create');

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
    
    const validation = homeValuesFormSchema.safeParse(formValues);
    if (!validation.success) {
      return {
        success: false,
        error: 'Validation failed. Please check your input.',
        fieldErrors: validation.error.flatten().fieldErrors,
        values: formValues,
        valueId: '',
      };
    }

    const result = await createHomeValue(validation.data);
    
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
        valueId: result.data?.id || '',
        data: updatedValues,
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to create home value',
        fieldErrors: result.fieldErrors || {},
        values: formValues,
        valueId: '',
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
        valueId: '',
      };
    }
    
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

    // Log and handle other errors
    logError(error as Error, { 
      action: 'createHomeValue',
      formData: extractFormValues(formData)
    });
    
    return {
      success: false,
      error: 'An unexpected error occurred while creating home value. Please try again.',
      fieldErrors: {},
      values: extractFormValues(formData),
      valueId: '',
    };
  }
}

function extractFormValues(formData: FormData): HomeValuesFormData {
  return {
    title: formData.get('title') as string || '',
    description: formData.get('description') as string || '',
    highlight: formData.get('highlight') as string || '',
    icon: formData.get('icon') as string || '',
    order: parseInt(formData.get('order') as string) || 0,
  };
}

function getDefaultValues(): HomeValuesFormData {
  return {
    title: '',
    description: '',
    highlight: '',
    icon: '',
    order: 0,
  };
}
