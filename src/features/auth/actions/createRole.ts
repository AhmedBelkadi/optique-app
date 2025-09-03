'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { createRole } from '@/features/auth/services/roleService';
import { logError } from '@/lib/errorHandling';
import { revalidateTag } from 'next/cache';
import { getCurrentUser } from '@/features/auth/services/session';

export interface CreateRoleState {
  success: boolean;
  error: string;
  fieldErrors: Record<string, string[]>;
  values: {
    name: string;
    description: string;
    permissions: string[];
  };
}

export async function createRoleAction(prevState: CreateRoleState, formData: FormData): Promise<CreateRoleState> {
  try {
    // 🔐 AUTHENTICATION CHECK - Ensure user is logged in
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        error: 'Authentication required. Please log in.',
        fieldErrors: {},
        values: {
          name: formData.get('name') as string,
          description: formData.get('description') as string,
          permissions: formData.getAll('permissions') as string[],
        },
      };
    }

    // 🔑 AUTHORIZATION CHECK - Only admins can create roles
    if (!currentUser.isAdmin) {
      return {
        success: false,
        error: 'Access denied. Only administrators can create roles.',
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

    const rawData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      permissions: formData.getAll('permissions') as string[],
    };

    // Basic validation
    if (!rawData.name || rawData.name.trim().length === 0) {
      return {
        success: false,
        error: '',
        fieldErrors: {
          name: ['Role name is required'],
        },
        values: rawData,
      };
    }

    if (rawData.name.trim().length < 2) {
      return {
        success: false,
        error: '',
        fieldErrors: {
          name: ['Role name must be at least 2 characters long'],
        },
        values: rawData,
      };
    }

    // Create role
    const role = await createRole({
      name: rawData.name.trim(),
      description: rawData.description.trim() || undefined,
      permissions: rawData.permissions,
    });

    // Invalidate cache to refresh the UI
    revalidateTag('roles');
    
    return {
      success: true,
      error: '',
      fieldErrors: {},
      values: {
        name: '',
        description: '',
        permissions: [],
      },
    };
  } catch (error) {
    // Handle rate limiting errors
    if (error instanceof Error && error.name === 'RateLimitError') {
      return {
        success: false,
        error: error.message,
        fieldErrors: {},
        values: {
          name: formData.get('name') as string,
          description: formData.get('description') as string,
          permissions: formData.getAll('permissions') as string[],
        },
      };
    }
    
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        success: false,
        error: 'Security validation failed. Please refresh the page and try again.',
        fieldErrors: {},
        values: {
          name: formData.get('name') as string,
          description: formData.get('description') as string,
          permissions: formData.getAll('permissions') as string[],
        },
      };
    }

    // Handle duplicate role name
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return {
        success: false,
        error: 'A role with this name already exists.',
        fieldErrors: {
          name: ['A role with this name already exists'],
        },
        values: {
          name: formData.get('name') as string,
          description: formData.get('description') as string,
          permissions: formData.getAll('permissions') as string[],
        },
      };
    }

    // Log error and return generic message
    logError(error as Error, { 
      action: 'createRole',
      userId: (await getCurrentUser())?.id,
    });

    return {
      success: false,
      error: 'Failed to create role. Please try again.',
      fieldErrors: {},
      values: {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        permissions: formData.getAll('permissions') as string[],
      },
    };
  }
}
