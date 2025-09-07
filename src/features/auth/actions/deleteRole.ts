'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { logError } from '@/lib/errorHandling';
import { revalidateTag } from 'next/cache';
import { getCurrentUser } from '@/features/auth/services/session';
import { ROLE_ERRORS } from '../schema/roleSchema';
import { deleteRoleWithValidation } from '../services/roleOperationService';

export interface DeleteRoleState {
  success: boolean;
  error: string;
}

export async function deleteRoleAction(prevState: DeleteRoleState, formData: FormData): Promise<DeleteRoleState> {
  try {
    // 🔐 AUTHENTICATION CHECK - Ensure user is logged in
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        error: ROLE_ERRORS.SESSION_NOT_FOUND,
      };
    }

    // 🔑 AUTHORIZATION CHECK - Only admins can delete roles
    if (!currentUser.isAdmin) {
      return {
        success: false,
        error: ROLE_ERRORS.PERMISSION_DENIED,
      };
    }

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    const roleId = (formData.get('roleId') as string)?.trim();
    
    if (!roleId) {
      return {
        success: false,
        error: 'Role ID is required',
      };
    }

    // Delete role using service layer
    const result = await deleteRoleWithValidation(roleId);

    if (result.success) {
      // Invalidate cache to refresh the UI
      revalidateTag('roles');
      revalidateTag('permissions');
      
      return {
        success: true,
        error: '',
      };
    } else {
      return {
        success: false,
        error: result.error || ROLE_ERRORS.ROLE_DELETE_FAILED,
      };
    }

  } catch (error) {
    // Handle rate limiting errors
    if (error instanceof Error && error.name === 'RateLimitError') {
      return {
        success: false,
        error: ROLE_ERRORS.RATE_LIMIT_EXCEEDED,
      };
    }
    
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        success: false,
        error: ROLE_ERRORS.CSRF_ERROR,
      };
    }

    // Handle permission/authorization errors
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      return {
        success: false,
        error: ROLE_ERRORS.PERMISSION_DENIED,
      };
    }

    // Log error and return generic message
    logError(error as Error, { 
      action: 'deleteRoleAction',
      roleId: formData.get('roleId') as string,
    });

    return {
      success: false,
      error: ROLE_ERRORS.UNEXPECTED_ERROR,
    };
  }
}
