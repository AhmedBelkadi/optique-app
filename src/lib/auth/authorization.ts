import { getCurrentUser } from '@/features/auth/services/session';
import { getUserPermissions } from '@/features/auth/services/roleService';
import { redirect } from 'next/navigation';

export interface Permission {
  id: string;
  name: string;
  description: string | null;
  resource: string;
  action: string;
  isActive: boolean;
}

export interface AuthorizationContext {
  userId: string;
  permissions: Permission[];
  hasPermission: (resource: string, action: string) => boolean;
  hasAnyPermission: (permissions: Array<{ resource: string; action: string }>) => boolean;
  hasAllPermissions: (permissions: Array<{ resource: string; action: string }>) => boolean;
  canAccessResource: (resource: string) => boolean;
  canPerformAction: (resource: string, action: string) => boolean;
}

/**
 * Check if a user has a specific permission
 */
export function hasPermission(
  userPermissions: Permission[],
  resource: string,
  action: string
): boolean {
  return userPermissions.some(
    permission =>
      permission.isActive &&
      permission.resource === resource &&
      permission.action === action
  );
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(
  userPermissions: Permission[],
  permissions: Array<{ resource: string; action: string }>
): boolean {
  return permissions.some(({ resource, action }) =>
    hasPermission(userPermissions, resource, action)
  );
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(
  userPermissions: Permission[],
  permissions: Array<{ resource: string; action: string }>
): boolean {
  return permissions.every(({ resource, action }) =>
    hasPermission(userPermissions, resource, action)
  );
}

/**
 * Check if a user can access a specific resource (has any permission for it)
 */
export function canAccessResource(
  userPermissions: Permission[],
  resource: string
): boolean {
  return userPermissions.some(
    permission =>
      permission.isActive && permission.resource === resource
  );
}

/**
 * Check if a user can perform a specific action on a resource
 */
export function canPerformAction(
  userPermissions: Permission[],
  resource: string,
  action: string
): boolean {
  return hasPermission(userPermissions, resource, action);
}

/**
 * Get user's authorization context
 */
export async function getAuthorizationContext(): Promise<AuthorizationContext | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const permissions = await getUserPermissions(user.id);
    
    return {
      userId: user.id,
      permissions,
      hasPermission: (resource: string, action: string) =>
        hasPermission(permissions, resource, action),
      hasAnyPermission: (requiredPermissions: Array<{ resource: string; action: string }>) =>
        hasAnyPermission(permissions, requiredPermissions),
      hasAllPermissions: (requiredPermissions: Array<{ resource: string; action: string }>) =>
        hasAllPermissions(permissions, requiredPermissions),
      canAccessResource: (resource: string) =>
        canAccessResource(permissions, resource),
      canPerformAction: (resource: string, action: string) =>
        canPerformAction(permissions, resource, action),
    };
  } catch (error) {
    console.error('Error getting authorization context:', error);
    return null;
  }
}

/**
 * Require specific permission for route access
 */
export async function requirePermission(
  resource: string,
  action: string,
  redirectTo: string = '/auth/login'
): Promise<AuthorizationContext> {
  const authContext = await getAuthorizationContext();
  
  if (!authContext) {
    redirect(redirectTo);
  }

  if (!authContext.hasPermission(resource, action)) {
    redirect('/admin/unauthorized');
  }

  return authContext;
}

/**
 * Require any of the specified permissions
 */
export async function requireAnyPermission(
  permissions: Array<{ resource: string; action: string }>,
  redirectTo: string = '/auth/login'
): Promise<AuthorizationContext> {
  const authContext = await getAuthorizationContext();
  
  if (!authContext) {
    redirect(redirectTo);
  }

  if (!authContext.hasAnyPermission(permissions)) {
    redirect('/admin/unauthorized');
  }

  return authContext;
}

/**
 * Require all of the specified permissions
 */
export async function requireAllPermissions(
  permissions: Array<{ resource: string; action: string }>,
  redirectTo: string = '/auth/login'
): Promise<AuthorizationContext> {
  const authContext = await getAuthorizationContext();
  
  if (!authContext) {
    redirect(redirectTo);
  }

  if (!authContext.hasAllPermissions(permissions)) {
    redirect('/admin/unauthorized');
  }

  return authContext;
}

/**
 * Require resource access (any permission for the resource)
 */
export async function requireResourceAccess(
  resource: string,
  redirectTo: string = '/auth/login'
): Promise<AuthorizationContext> {
  const authContext = await getAuthorizationContext();
  
  if (!authContext) {
    redirect(redirectTo);
  }

  if (!authContext.canAccessResource(resource)) {
    redirect('/admin/unauthorized');
  }

  return authContext;
}

/**
 * Check if user is admin (has admin role)
 */
  export async function requireAdmin(redirectTo: string = '/auth/login'): Promise<AuthorizationContext> {
  const authContext = await getAuthorizationContext();
  
  if (!authContext) {
    redirect(redirectTo);
  }

  // For session-based auth, we'll check if user has admin role via the session
  // This is handled by the getCurrentUser function which already checks isAdmin
  const user = await getCurrentUser();
  if (!user?.isAdmin) {
    redirect('/admin/unauthorized');
  }

  return authContext;
}

/**
 * Permission constants for common operations
 */
export const PERMISSIONS = {
  // User Management
  USERS: {
    CREATE: { resource: 'users', action: 'create' },
    READ: { resource: 'users', action: 'read' },
    UPDATE: { resource: 'users', action: 'update' },
    DELETE: { resource: 'users', action: 'delete' },
    MANAGE: { resource: 'users', action: 'manage' },
  },
  
  // Role Management
  ROLES: {
    CREATE: { resource: 'roles', action: 'create' },
    READ: { resource: 'roles', action: 'read' },
    UPDATE: { resource: 'roles', action: 'update' },
    DELETE: { resource: 'roles', action: 'delete' },
    MANAGE: { resource: 'roles', action: 'manage' },
  },
  
  // Permission Management
  PERMISSIONS: {
    CREATE: { resource: 'permissions', action: 'create' },
    READ: { resource: 'permissions', action: 'read' },
    UPDATE: { resource: 'permissions', action: 'update' },
    DELETE: { resource: 'permissions', action: 'delete' },
    MANAGE: { resource: 'permissions', action: 'manage' },
  },
  
  // Product Management
  PRODUCTS: {
    CREATE: { resource: 'products', action: 'create' },
    READ: { resource: 'products', action: 'read' },
    UPDATE: { resource: 'products', action: 'update' },
    DELETE: { resource: 'products', action: 'delete' },
    MANAGE: { resource: 'products', action: 'manage' },
  },
  
  // Category Management
  CATEGORIES: {
    CREATE: { resource: 'categories', action: 'create' },
    READ: { resource: 'categories', action: 'read' },
    UPDATE: { resource: 'categories', action: 'update' },
    DELETE: { resource: 'categories', action: 'delete' },
    MANAGE: { resource: 'categories', action: 'manage' },
  },
  
  // Appointment Management
  APPOINTMENTS: {
    CREATE: { resource: 'appointments', action: 'create' },
    READ: { resource: 'appointments', action: 'read' },
    UPDATE: { resource: 'appointments', action: 'update' },
    DELETE: { resource: 'appointments', action: 'delete' },
    MANAGE: { resource: 'appointments', action: 'manage' },
  },
  
  // Customer Management
  CUSTOMERS: {
    CREATE: { resource: 'customers', action: 'create' },
    READ: { resource: 'customers', action: 'read' },
    UPDATE: { resource: 'customers', action: 'update' },
    DELETE: { resource: 'customers', action: 'delete' },
    MANAGE: { resource: 'customers', action: 'manage' },
  },
  
  // Banner Management
  BANNERS: {
    CREATE: { resource: 'banners', action: 'create' },
    READ: { resource: 'banners', action: 'read' },
    UPDATE: { resource: 'banners', action: 'update' },
    DELETE: { resource: 'banners', action: 'delete' },
    MANAGE: { resource: 'banners', action: 'manage' },
  },
  
  // Settings Management
  SETTINGS: {
    READ: { resource: 'settings', action: 'read' },
    UPDATE: { resource: 'settings', action: 'update' },
    MANAGE: { resource: 'settings', action: 'manage' },
  },
  
  // System Administration
  SYSTEM: {
    ADMIN: { resource: 'system', action: 'admin' },
    MAINTENANCE: { resource: 'system', action: 'maintenance' },
  },
} as const;

/**
 * Resource-level permission groups
 */
export const RESOURCE_PERMISSIONS = {
  USERS: [
    PERMISSIONS.USERS.CREATE,
    PERMISSIONS.USERS.READ,
    PERMISSIONS.USERS.UPDATE,
    PERMISSIONS.USERS.DELETE,
    PERMISSIONS.USERS.MANAGE,
  ],
  
  ROLES: [
    PERMISSIONS.ROLES.CREATE,
    PERMISSIONS.ROLES.READ,
    PERMISSIONS.ROLES.UPDATE,
    PERMISSIONS.ROLES.DELETE,
    PERMISSIONS.ROLES.MANAGE,
  ],
  
  PERMISSIONS: [
    PERMISSIONS.PERMISSIONS.CREATE,
    PERMISSIONS.PERMISSIONS.READ,
    PERMISSIONS.PERMISSIONS.UPDATE,
    PERMISSIONS.PERMISSIONS.DELETE,
    PERMISSIONS.PERMISSIONS.MANAGE,
  ],
  
  PRODUCTS: [
    PERMISSIONS.PRODUCTS.CREATE,
    PERMISSIONS.PRODUCTS.READ,
    PERMISSIONS.PRODUCTS.UPDATE,
    PERMISSIONS.PRODUCTS.DELETE,
    PERMISSIONS.PRODUCTS.MANAGE,
  ],
  
  CATEGORIES: [
    PERMISSIONS.CATEGORIES.CREATE,
    PERMISSIONS.CATEGORIES.READ,
    PERMISSIONS.CATEGORIES.UPDATE,
    PERMISSIONS.CATEGORIES.DELETE,
    PERMISSIONS.CATEGORIES.MANAGE,
  ],
  
  APPOINTMENTS: [
    PERMISSIONS.APPOINTMENTS.CREATE,
    PERMISSIONS.APPOINTMENTS.READ,
    PERMISSIONS.APPOINTMENTS.UPDATE,
    PERMISSIONS.APPOINTMENTS.DELETE,
    PERMISSIONS.APPOINTMENTS.MANAGE,
  ],
  
  CUSTOMERS: [
    PERMISSIONS.CUSTOMERS.CREATE,
    PERMISSIONS.CUSTOMERS.READ,
    PERMISSIONS.CUSTOMERS.UPDATE,
    PERMISSIONS.CUSTOMERS.DELETE,
    PERMISSIONS.CUSTOMERS.MANAGE,
  ],
  
  BANNERS: [
    PERMISSIONS.BANNERS.CREATE,
    PERMISSIONS.BANNERS.READ,
    PERMISSIONS.BANNERS.UPDATE,
    PERMISSIONS.BANNERS.DELETE,
    PERMISSIONS.BANNERS.MANAGE,
  ],
  
  SETTINGS: [
    PERMISSIONS.SETTINGS.READ,
    PERMISSIONS.SETTINGS.UPDATE,
    PERMISSIONS.SETTINGS.MANAGE,
  ],
} as const;
