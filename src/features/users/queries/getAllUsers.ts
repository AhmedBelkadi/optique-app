import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/features/auth/services/session';

export interface UserWithRoles {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  userRoles: Array<{
    id: string;
    roleId: string;
    role: {
      id: string;
      name: string;
      description: string | null;
    };
  }>;
}

export async function getAllUsers(): Promise<UserWithRoles[]> {
  try {
    // Check if current user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser?.isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }

    // Get all users with their roles
    const users = await prisma.user.findMany({
      where: {
        // Exclude the current user from the list
        id: { not: currentUser.id },
        // Show all users (active and inactive) for admin management
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        createdAt: true,
        userRoles: {
          select: {
            id: true,
            roleId: true,
            role: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}
