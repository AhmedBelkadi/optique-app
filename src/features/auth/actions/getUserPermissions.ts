'use server';

import { getCurrentUser } from '@/features/auth/services/session';
import { getUserPermissions } from '@/features/auth/services/roleService';
import { Permission } from '@/lib/auth/authorization';

export interface GetUserPermissionsResult {
  success: boolean;
  permissions: Permission[];
  userId: string;
  error?: string;
}

/**
 * Server action to get current user's permissions
 */
export async function getUserPermissionsAction(): Promise<GetUserPermissionsResult> {
  try {
    // Get current user
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        permissions: [],
        userId: '',
        error: 'Not authenticated'
      };
    }

    // Get user permissions
    const permissions = await getUserPermissions(user.id);

    return {
      success: true,
      permissions,
      userId: user.id,
    };
  } catch (error) {
    console.error('Error getting user permissions:', error);
    return {
      success: false,
      permissions: [],
      userId: '',
      error: 'Internal server error'
    };
  }
}
