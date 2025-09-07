import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/errorHandling';
import { CreateRoleInput, UpdateRoleInput, ROLE_ERRORS } from '../schema/roleSchema';

export interface RoleOperationResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
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

// Sanitize input to prevent XSS
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 500); // Limit length
}

// Validate that all permission IDs exist
async function validatePermissions(permissionIds: string[]): Promise<{ valid: boolean; invalidIds: string[] }> {
  const existingPermissions = await prisma.permission.findMany({
    where: {
      id: { in: permissionIds },
      isActive: true,
    },
    select: { id: true },
  });

  const existingIds = new Set(existingPermissions.map(p => p.id));
  const invalidIds = permissionIds.filter(id => !existingIds.has(id));

  return {
    valid: invalidIds.length === 0,
    invalidIds,
  };
}

// Check if role name is unique (excluding current role for updates)
async function isRoleNameUnique(name: string, excludeRoleId?: string): Promise<boolean> {
  const existingRole = await prisma.role.findFirst({
    where: {
      name: { equals: name, mode: 'insensitive' },
      isActive: true,
      ...(excludeRoleId && { id: { not: excludeRoleId } }),
    },
  });

  return !existingRole;
}

// Check if role is protected (admin, etc.)
function isRoleProtected(roleName: string): boolean {
  const protectedRoles = ['admin', 'superadmin', 'root'];
  return protectedRoles.includes(roleName.toLowerCase());
}

// Check if role is in use by users
async function isRoleInUse(roleId: string): Promise<boolean> {
  const userCount = await prisma.userRole.count({
    where: { roleId },
  });
  return userCount > 0;
}

export async function createRoleWithValidation(
  roleData: CreateRoleInput,
  createdBy: string
): Promise<RoleOperationResult> {
  try {
    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(roleData.name),
      description: roleData.description ? sanitizeInput(roleData.description) : null,
      permissions: roleData.permissions,
    };

    // Check if role name is unique
    if (!(await isRoleNameUnique(sanitizedData.name))) {
      return {
        success: false,
        error: ROLE_ERRORS.ROLE_ALREADY_EXISTS,
        fieldErrors: {
          name: [ROLE_ERRORS.ROLE_ALREADY_EXISTS],
        },
      };
    }

    // Check if role is protected
    if (isRoleProtected(sanitizedData.name)) {
      return {
        success: false,
        error: ROLE_ERRORS.ADMIN_ROLE_PROTECTED,
        fieldErrors: {
          name: [ROLE_ERRORS.ADMIN_ROLE_PROTECTED],
        },
      };
    }

    // Validate permissions exist
    const permissionValidation = await validatePermissions(sanitizedData.permissions);
    if (!permissionValidation.valid) {
      return {
        success: false,
        error: ROLE_ERRORS.PERMISSION_NOT_FOUND,
        fieldErrors: {
          permissions: [`Invalid permission IDs: ${permissionValidation.invalidIds.join(', ')}`],
        },
      };
    }

    // Create role with permissions in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the role
      const role = await tx.role.create({
        data: {
          name: sanitizedData.name,
          description: sanitizedData.description,
        },
      });

      // Create role-permission relationships
      if (sanitizedData.permissions.length > 0) {
        await tx.rolePermission.createMany({
          data: sanitizedData.permissions.map(permissionId => ({
            roleId: role.id,
            permissionId,
            grantedBy: createdBy,
          })),
        });
      }

      // Get the created role with permissions
      const roleWithPermissions = await tx.role.findUnique({
        where: { id: role.id },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      });

      return roleWithPermissions!;
    });

    return {
      success: true,
      data: {
        role: {
          id: result.id,
          name: result.name,
          description: result.description,
          isActive: result.isActive,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
        },
        permissions: result.permissions.map(rp => ({
          id: rp.permission.id,
          name: rp.permission.name,
          resource: rp.permission.resource,
          action: rp.permission.action,
        })),
      },
    };

  } catch (error) {
    logError(error as Error, {
      action: 'createRoleWithValidation',
      roleData: {
        name: roleData.name,
        description: roleData.description,
        permissionsCount: roleData.permissions.length,
      },
      createdBy,
    });

    return {
      success: false,
      error: ROLE_ERRORS.ROLE_CREATION_FAILED,
    };
  }
}

export async function updateRoleWithValidation(
  roleData: UpdateRoleInput,
  updatedBy: string
): Promise<RoleOperationResult> {
  try {
    // Sanitize inputs
    const sanitizedData = {
      roleId: roleData.roleId,
      name: sanitizeInput(roleData.name),
      description: roleData.description ? sanitizeInput(roleData.description) : null,
      permissions: roleData.permissions,
    };

    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id: sanitizedData.roleId },
    });

    if (!existingRole) {
      return {
        success: false,
        error: ROLE_ERRORS.ROLE_NOT_FOUND,
      };
    }

    // Check if trying to modify protected role
    if (isRoleProtected(existingRole.name)) {
      return {
        success: false,
        error: ROLE_ERRORS.ADMIN_ROLE_PROTECTED,
        fieldErrors: {
          name: [ROLE_ERRORS.ADMIN_ROLE_PROTECTED],
        },
      };
    }

    // Check if new name is unique (excluding current role)
    if (sanitizedData.name.toLowerCase() !== existingRole.name.toLowerCase()) {
      if (!(await isRoleNameUnique(sanitizedData.name, sanitizedData.roleId))) {
        return {
          success: false,
          error: ROLE_ERRORS.ROLE_ALREADY_EXISTS,
          fieldErrors: {
            name: [ROLE_ERRORS.ROLE_ALREADY_EXISTS],
          },
        };
      }
    }

    // Validate permissions exist
    const permissionValidation = await validatePermissions(sanitizedData.permissions);
    if (!permissionValidation.valid) {
      return {
        success: false,
        error: ROLE_ERRORS.PERMISSION_NOT_FOUND,
        fieldErrors: {
          permissions: [`Invalid permission IDs: ${permissionValidation.invalidIds.join(', ')}`],
        },
      };
    }

    // Update role with permissions in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update the role
      const updatedRole = await tx.role.update({
        where: { id: sanitizedData.roleId },
        data: {
          name: sanitizedData.name,
          description: sanitizedData.description,
        },
      });

      // Update permissions
      await tx.rolePermission.deleteMany({
        where: { roleId: sanitizedData.roleId },
      });

      if (sanitizedData.permissions.length > 0) {
        await tx.rolePermission.createMany({
          data: sanitizedData.permissions.map(permissionId => ({
            roleId: sanitizedData.roleId,
            permissionId,
            grantedBy: updatedBy,
          })),
        });
      }

      // Get the updated role with permissions
      const roleWithPermissions = await tx.role.findUnique({
        where: { id: sanitizedData.roleId },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      });

      return roleWithPermissions!;
    });

    return {
      success: true,
      data: {
        role: {
          id: result.id,
          name: result.name,
          description: result.description,
          isActive: result.isActive,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
        },
        permissions: result.permissions.map(rp => ({
          id: rp.permission.id,
          name: rp.permission.name,
          resource: rp.permission.resource,
          action: rp.permission.action,
        })),
      },
    };

  } catch (error) {
    logError(error as Error, {
      action: 'updateRoleWithValidation',
      roleId: roleData.roleId,
      roleData: {
        name: roleData.name,
        description: roleData.description,
        permissionsCount: roleData.permissions.length,
      },
      updatedBy,
    });

    return {
      success: false,
      error: ROLE_ERRORS.ROLE_UPDATE_FAILED,
    };
  }
}

export async function deleteRoleWithValidation(
  roleId: string
): Promise<RoleOperationResult> {
  try {
    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!existingRole) {
      return {
        success: false,
        error: ROLE_ERRORS.ROLE_NOT_FOUND,
      };
    }

    // Check if role is protected
    if (isRoleProtected(existingRole.name)) {
      return {
        success: false,
        error: ROLE_ERRORS.ADMIN_ROLE_PROTECTED,
      };
    }

    // Check if role is in use
    if (await isRoleInUse(roleId)) {
      return {
        success: false,
        error: ROLE_ERRORS.ROLE_IN_USE,
      };
    }

    // Soft delete the role
    await prisma.role.update({
      where: { id: roleId },
      data: { isActive: false },
    });

    return {
      success: true,
    };

  } catch (error) {
    logError(error as Error, {
      action: 'deleteRoleWithValidation',
      roleId,
    });

    return {
      success: false,
      error: ROLE_ERRORS.ROLE_DELETE_FAILED,
    };
  }
}
