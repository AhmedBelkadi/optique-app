'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/errorHandling';
import { getCurrentUser } from '@/features/auth/services/session';
import { revalidateTag } from 'next/cache';

export interface CreatePermissionState {
  success: boolean;
  error: string;
  fieldErrors: Record<string, string[]>;
  values: {
    name: string;
    description: string;
    resource: string;
    action: string;
  };
}

export async function createPermissionAction(prevState: CreatePermissionState, formData: FormData): Promise<CreatePermissionState> {
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
          resource: formData.get('resource') as string,
          action: formData.get('action') as string,
        },
      };
    }

    // 🔑 AUTHORIZATION CHECK - Only admins can create permissions
    if (!currentUser.isAdmin) {
      return {
        success: false,
        error: 'Access denied. Only administrators can create permissions.',
        fieldErrors: {},
        values: {
          name: formData.get('name') as string,
          description: formData.get('description') as string,
          resource: formData.get('resource') as string,
          action: formData.get('action') as string,
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
      resource: formData.get('resource') as string,
      action: formData.get('action') as string,
    };

    // Comprehensive validation
    const fieldErrors: Record<string, string[]> = {};

    if (!rawData.name || rawData.name.trim().length === 0) {
      fieldErrors.name = ['Permission name is required'];
    } else if (rawData.name.trim().length < 3) {
      fieldErrors.name = ['Permission name must be at least 3 characters long'];
    } else if (rawData.name.trim().length > 50) {
      fieldErrors.name = ['Permission name must be less than 50 characters'];
    }

    if (!rawData.resource || rawData.resource.trim().length === 0) {
      fieldErrors.resource = ['Resource is required'];
    } else if (rawData.resource.trim().length < 2) {
      fieldErrors.resource = ['Resource must be at least 2 characters long'];
    }

    if (!rawData.action || rawData.action.trim().length === 0) {
      fieldErrors.action = ['Action is required'];
    } else if (rawData.action.trim().length < 2) {
      fieldErrors.action = ['Action must be at least 2 characters long'];
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        error: '',
        fieldErrors,
        values: rawData,
      };
    }

    // Check if permission already exists
    const existingPermission = await prisma.permission.findFirst({
      where: {
        AND: [
          { resource: rawData.resource.trim() },
          { action: rawData.action.trim() }
        ]
      }
    });

    if (existingPermission) {
      return {
        success: false,
        error: `A permission for ${rawData.resource}:${rawData.action} already exists.`,
        fieldErrors: {
          resource: ['This resource-action combination already exists'],
          action: ['This resource-action combination already exists'],
        },
        values: rawData,
      };
    }

    // Create permission
    const permission = await prisma.permission.create({
      data: {
        name: rawData.name.trim(),
        description: rawData.description.trim() || undefined,
        resource: rawData.resource.trim().toLowerCase(),
        action: rawData.action.trim().toLowerCase(),
        isActive: true,
      },
    });

    // Invalidate cache to refresh the UI
    revalidateTag('permissions');
    revalidateTag('roles');
    
    return {
      success: true,
      error: '',
      fieldErrors: {},
      values: {
        name: '',
        description: '',
        resource: '',
        action: '',
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
          resource: formData.get('resource') as string,
          action: formData.get('action') as string,
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
          resource: formData.get('resource') as string,
          action: formData.get('action') as string,
        },
      };
    }

    // Log error and return generic message
    logError(error as Error, { 
      action: 'createPermission',
      userId: (await getCurrentUser())?.id,
      formData: formData,
    });

    return {
      success: false,
      error: 'Failed to create permission. Please try again.',
      fieldErrors: {},
      values: {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        resource: formData.get('resource') as string,
        action: formData.get('action') as string,
      },
    };
  }
}
