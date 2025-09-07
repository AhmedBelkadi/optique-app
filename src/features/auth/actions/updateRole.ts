'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { logError } from '@/lib/errorHandling';
import { revalidateTag } from 'next/cache';
import { getCurrentUser } from '@/features/auth/services/session';
import { updateRoleSchema, UpdateRoleInput, ROLE_ERRORS } from '../schema/roleSchema';
import { updateRoleWithValidation } from '../services/roleOperationService';

export interface UpdateRoleState {
  success: boolean;
  error: string;
  fieldErrors: Record<string, string[]>;
  values: {
    name: string;
    description: string;
    permissions: string[];
  };
  data?: {
    role: {
      id: string;
      name: string;
      description: string | null;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
    permissions: Array<{
      id: string;
      name: string;
      resource: string;
      action: string;
    }>;
  };
}

export async function updateRoleAction(prevState: UpdateRoleState, formData: FormData): Promise<UpdateRoleState> {
  try {
    // 🔐 AUTHENTICATION CHECK - Ensure user is logged in
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        error: ROLE_ERRORS.SESSION_NOT_FOUND,
        fieldErrors: {},
        values: {
          name: formData.get('name') as string,
          description: formData.get('description') as string,
          permissions: formData.getAll('permissions') as string[],
        },
      };
    }

    // 🔑 AUTHORIZATION CHECK - Only admins can update roles
    if (!currentUser.isAdmin) {
      return {
        success: false,
        error: ROLE_ERRORS.PERMISSION_DENIED,
        fieldErrors: {},
        values: {
          name: formData.get('name') as string,
          description: formData.get('description') as string,
          permissions: formData.getAll('permissions') as string[],
        },
      };
    }

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    // Extract and sanitize form data
    const rawData = {
      roleId: (formData.get('roleId') as string)?.trim() || '',
      name: (formData.get('name') as string)?.trim() || '',
      description: (formData.get('description') as string)?.trim() || '',
      permissions: formData.getAll('permissions') as string[],
    };

    // Validate input using Zod schema
    const validation = updateRoleSchema.safeParse(rawData);
    if (!validation.success) {
      return {
        success: false,
        error: ROLE_ERRORS.VALIDATION_FAILED,
        fieldErrors: validation.error.flatten().fieldErrors,
        values: rawData,
      };
    }

    const validatedData = validation.data;

    // Update role using service layer
    const result = await updateRoleWithValidation(validatedData, currentUser.id);

    if (result.success) {
      // Invalidate cache to refresh the UI
      revalidateTag('roles');
      revalidateTag('permissions');
      
      return {
        success: true,
        error: '',
        fieldErrors: {},
        values: {
          name: '',
          description: '',
          permissions: [],
        },
        data: result.data,
      };
    } else {
      return {
        success: false,
        error: result.error || ROLE_ERRORS.ROLE_UPDATE_FAILED,
        fieldErrors: result.fieldErrors || {},
        values: rawData,
      };
    }

  } catch (error) {
    // Handle rate limiting errors
    if (error instanceof Error && error.name === 'RateLimitError') {
      return {
        success: false,
        error: ROLE_ERRORS.RATE_LIMIT_EXCEEDED,
        fieldErrors: {},
        values: {
          name: (formData.get('name') as string) || '',
          description: (formData.get('description') as string) || '',
          permissions: formData.getAll('permissions') as string[],
        },
      };
    }
    
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        success: false,
        error: ROLE_ERRORS.CSRF_ERROR,
        fieldErrors: {},
        values: {
          name: (formData.get('name') as string) || '',
          description: (formData.get('description') as string) || '',
          permissions: formData.getAll('permissions') as string[],
        },
      };
    }

    // Handle permission/authorization errors
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      return {
        success: false,
        error: ROLE_ERRORS.PERMISSION_DENIED,
        fieldErrors: {},
        values: {
          name: '',
          description: '',
          permissions: [],
        }
      };
    }

    // Log error and return generic message
    logError(error as Error, { 
      action: 'updateRoleAction',
      formData: {
        roleId: formData.get('roleId'),
        name: formData.get('name'),
        description: formData.get('description'),
        permissions: formData.getAll('permissions'),
      }
    });

    return {
      success: false,
      error: ROLE_ERRORS.UNEXPECTED_ERROR,
      fieldErrors: {},
      values: {
        name: (formData.get('name') as string) || '',
        description: (formData.get('description') as string) || '',
        permissions: formData.getAll('permissions') as string[],
      },
    };
  }
}
