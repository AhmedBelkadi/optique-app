'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { deleteRole } from '@/features/auth/services/roleService';
import { logError } from '@/lib/errorHandling';
import { revalidateTag } from 'next/cache';
import { getCurrentUser } from '@/features/auth/services/session';
import { prisma } from '@/lib/prisma';

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
        error: 'Authentication required. Please log in.',
      };
    }

    // 🔑 AUTHORIZATION CHECK - Only admins can delete roles
    if (!currentUser.isAdmin) {
      return {
        success: false,
        error: 'Access denied. Only administrators can delete roles.',
      };
    }

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    const roleId = formData.get('roleId') as string;
    
    if (!roleId) {
      return {
        success: false,
        error: 'Role ID is required',
      };
    }

    // Check if role is used by any users
    const usersWithRole = await prisma.userRole.count({
      where: { roleId },
    });

    if (usersWithRole > 0) {
      return {
        success: false,
        error: `Cannot delete role. It is assigned to ${usersWithRole} user(s). Please reassign or remove users from this role first.`,
      };
    }

    // Check if trying to delete admin role
    const role = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (role?.name === 'admin') {
      return {
        success: false,
        error: 'Cannot delete the admin role. This role is required for system administration.',
      };
    }

    // Delete role
    await deleteRole(roleId);

    // Invalidate cache to refresh the UI
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

    // Handle role not found
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return {
        success: false,
        error: 'Role not found or has already been deleted.',
      };
    }

    // Log error and return generic message
    logError(error as Error, { 
      action: 'deleteRole',
      userId: (await getCurrentUser())?.id,
      roleId: formData.get('roleId') as string,
    });

    return {
      success: false,
      error: 'Failed to delete role. Please try again.',
    };
  }
}
