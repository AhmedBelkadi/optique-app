import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/shared/utils/crypto';
import { ProfileUpdateInput, PasswordChangeInput } from '../schema/profileSchema';

export interface ProfileUpdateResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export interface PasswordChangeResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
  roles: string[];
  isAdmin: boolean;
  isStaff: boolean;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) return null;

    const roles = user.userRoles.map(ur => ur.role.name);
    const isAdmin = roles.includes('admin');
    const isStaff = roles.includes('staff') || isAdmin;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt,
      roles,
      isAdmin,
      isStaff,
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function updateProfile(
  userId: string, 
  profileData: ProfileUpdateInput
): Promise<ProfileUpdateResult> {
  try {
    // Check if email is already taken by another user
    if (profileData.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: profileData.email,
          id: { not: userId },
        },
      });

      if (existingUser) {
        return {
          success: false,
          error: 'Cette adresse email est déjà utilisée par un autre utilisateur',
        };
      }
    }

    // Update user profile
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone || null,
        updatedAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return {
      success: false,
      error: 'Erreur lors de la mise à jour du profil',
    };
  }
}

export async function changePassword(
  userId: string, 
  passwordData: PasswordChangeInput
): Promise<PasswordChangeResult> {
  try {
    // Get current user to verify current password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      return {
        success: false,
        error: 'Utilisateur non trouvé',
      };
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(
      passwordData.currentPassword, 
      user.password
    );

    if (!isCurrentPasswordValid) {
      return {
        success: false,
        error: 'Le mot de passe actuel est incorrect',
      };
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(passwordData.newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error changing password:', error);
    return {
      success: false,
      error: 'Erreur lors du changement de mot de passe',
    };
  }
}

export async function updateLastLogin(userId: string): Promise<void> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        lastLoginAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Error updating last login:', error);
  }
}
