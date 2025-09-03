'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/errorHandling';
import { getCurrentUser } from '@/features/auth/services/session';
import { revalidateTag } from 'next/cache';

export interface DeletePermissionState {
  success: boolean;
  error: string;
}

export async function deletePermissionAction(prevState: DeletePermissionState, formData: FormData): Promise<DeletePermissionState> {
  try {
    // 🔐 AUTHENTICATION CHECK - Ensure user is logged in
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        error: 'Authentication required. Please log in.',
      };
    }

    // 🔑 AUTHORIZATION CHECK - Only admins can delete permissions
    if (!currentUser.isAdmin) {
      return {
        success: false,
        error: 'Access denied. Only administrators can delete permissions.',
      };
    }

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    const permissionId = formData.get('permissionId') as string;
    
    if (!permissionId) {
      return {
        success: false,
        error: 'Permission ID is required',
      };
    }

    // Check if permission exists
    const permission = await prisma.permission.findUnique({
      where: { id: permissionId },
      include: {
        rolePermissions: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!permission) {
      return {
        success: false,
        error: 'Permission not found',
      };
    }

    // Check if permission is assigned to any roles
    if (permission.rolePermissions.length > 0) {
      const roleNames = permission.rolePermissions.map(rp => rp.role.name).join(', ');
      return {
        success: false,
        error: `Cannot delete permission "${permission.name}" as it is currently assigned to the following roles: ${roleNames}. Please remove the permission from these roles first.`,
      };
    }

    // Soft delete the permission (set isActive to false)
    await prisma.permission.update({
      where: { id: permissionId },
      data: { isActive: false },
    });

    // Invalidate cache to refresh the UI
    revalidateTag('permissions');
    revalidateTag('roles');
    
    return {
      success: true,
      error: '',
    };
  } catch (error) {
    // Handle rate limiting errors
    if (error instanceof Error && error.name === 'RateLimitError') {
      return {
        success: false,
        error: error.message,
      };
    }
    
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        success: false,
        error: 'Security validation failed. Please refresh the page and try again.',
      };
    }

    // Log error and return generic message
    logError(error as Error, { 
      action: 'deletePermission',
      userId: (await getCurrentUser())?.id,
      permissionId: formData.get('permissionId'),
    });
    
    return {
      success: false,
      error: 'Failed to delete permission. Please try again.',
    };
  }
}
