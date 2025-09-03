import { prisma } from '@/lib/prisma';

export interface Role {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  description: string | null;
  resource: string;
  action: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  assignedBy: string | null;
  assignedAt: Date;
  role: Role;
}

export interface CreateRoleData {
  name: string;
  description?: string;
  permissions?: string[]; // Array of permission IDs
  assignedBy?: string; // ID of admin who created this role
}

export interface AssignRoleData {
  userId: string;
  roleId: string;
  assignedBy: string;
}

// Role Management
export async function createRole(data: CreateRoleData): Promise<Role> {
  const role = await prisma.role.create({
    data: {
      name: data.name,
      description: data.description,
    },
  });

  // If permissions are provided, assign them to the role
  if (data.permissions && data.permissions.length > 0) {
    await prisma.rolePermission.createMany({
      data: data.permissions.map(permissionId => ({
        roleId: role.id,
        permissionId,
        grantedBy: data.assignedBy,
      })),
    });
  }

  return role;
}

export async function getRoleById(id: string): Promise<Role | null> {
  return await prisma.role.findUnique({
    where: { id },
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });
}

export async function getRoleByName(name: string): Promise<Role | null> {
  return await prisma.role.findUnique({
    where: { name },
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });
}

export async function getAllRoles(): Promise<Role[]> {
  return await prisma.role.findMany({
    where: { isActive: true },
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });
}

export async function getAllRolesWithDetails(): Promise<Array<Role & { userCount: number; permissions: Permission[] }>> {
  const roles = await prisma.role.findMany({
    where: { isActive: true },
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
      _count: {
        select: {
          userRoles: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  return roles.map(role => ({
    ...role,
    userCount: role._count.userRoles,
    permissions: role.permissions.map(rp => rp.permission),
  }));
}

export async function updateRole(id: string, data: Partial<CreateRoleData>): Promise<Role> {
  // Start a transaction to update role and permissions atomically
  return await prisma.$transaction(async (tx) => {
    // Update the role basic info
    const updatedRole = await tx.role.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
      },
    });

    // If permissions are provided, update them
    if (data.permissions !== undefined) {
      // Remove all existing permissions for this role
      await tx.rolePermission.deleteMany({
        where: { roleId: id },
      });

      // Add new permissions if any are provided
      if (data.permissions.length > 0) {
        await tx.rolePermission.createMany({
          data: data.permissions.map(permissionId => ({
            roleId: id,
            permissionId,
            grantedBy: data.assignedBy || null,
          })),
        });
      }
    }

    return updatedRole;
  });
}

export async function deleteRole(id: string): Promise<void> {
  await prisma.role.update({
    where: { id },
    data: { isActive: false },
  });
}

// User Role Management
export async function assignRoleToUser(data: AssignRoleData): Promise<UserRole> {
  // Check if user already has this role
  const existingRole = await prisma.userRole.findUnique({
    where: {
      userId_roleId: {
        userId: data.userId,
        roleId: data.roleId,
      },
    },
  });

  if (existingRole) {
    throw new Error('User already has this role');
  }

  return await prisma.userRole.create({
    data: {
      userId: data.userId,
      roleId: data.roleId,
      assignedBy: data.assignedBy,
    },
    include: {
      role: true,
    },
  });
}

export async function removeRoleFromUser(userId: string, roleId: string): Promise<void> {
  await prisma.userRole.delete({
    where: {
      userId_roleId: {
        userId,
        roleId,
      },
    },
  });
}

export async function getUserRoles(userId: string): Promise<UserRole[]> {
  return await prisma.userRole.findMany({
    where: { userId },
    include: {
      role: true,
    },
  });
}

export async function getUserRoleNames(userId: string): Promise<string[]> {
  const userRoles = await getUserRoles(userId);
  return userRoles.map(ur => ur.role.name);
}

// Permission Management
export async function createPermission(data: {
  name: string;
  description?: string;
  resource: string;
  action: string;
}): Promise<Permission> {
  return await prisma.permission.create({
    data,
  });
}

export async function getAllPermissions(): Promise<Permission[]> {
  return await prisma.permission.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      description: true,
      resource: true,
      action: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: [{ resource: 'asc' }, { action: 'asc' }],
  });
}

export async function getPermissionsByResource(resource: string): Promise<Permission[]> {
  return await prisma.permission.findMany({
    where: { 
      resource,
      isActive: true 
    },
    select: {
      id: true,
      name: true,
      description: true,
      resource: true,
      action: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { action: 'asc' },
  });
}

// Permission Checking
export async function checkUserPermission(
  userId: string, 
  resource: string, 
  action: string
): Promise<boolean> {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });

  for (const userRole of userRoles) {
    if (!userRole.role.isActive) continue;
    
    for (const rolePermission of userRole.role.permissions) {
      if (!rolePermission.permission.isActive) continue;
      
      if (rolePermission.permission.resource === resource && 
          rolePermission.permission.action === action) {
        return true;
      }
    }
  }

  return false;
}

export async function getUserPermissions(userId: string): Promise<Permission[]> {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });

  const permissions = new Set<string>();
  const permissionObjects: Permission[] = [];

  for (const userRole of userRoles) {
    if (!userRole.role.isActive) continue;
    
    for (const rolePermission of userRole.role.permissions) {
      if (!rolePermission.permission.isActive) continue;
      
      const permissionKey = `${rolePermission.permission.resource}:${rolePermission.permission.action}`;
      if (!permissions.has(permissionKey)) {
        permissions.add(permissionKey);
        permissionObjects.push({
          ...rolePermission.permission,
          createdAt: rolePermission.permission.createdAt || new Date(),
          updatedAt: rolePermission.permission.updatedAt || new Date(),
        });
      }
    }
  }

  return permissionObjects;
}

// Check if user has admin role
export async function isUserAdmin(userId: string): Promise<boolean> {
  const userRoles = await getUserRoles(userId);
  return userRoles.some(ur => ur.role.name === 'admin');
}

// Check if user has staff role
export async function isUserStaff(userId: string): Promise<boolean> {
  const userRoles = await getUserRoles(userId);
  return userRoles.some(ur => ur.role.name === 'staff');
}
