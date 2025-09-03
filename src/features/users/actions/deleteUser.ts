'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/errorHandling';
import { getCurrentUser } from '@/features/auth/services/session';
import { requirePermission } from '@/lib/auth/authorization';

export interface DeactivateUserState {
  success?: boolean;
  error?: string;
}

export async function deactivateUserAction(prevState: DeactivateUserState, formData: FormData): Promise<DeactivateUserState> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('users', 'delete');

        // Get current user for role assignment
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          return {
            success: false,
            error: 'User session not found. Please log in again.',
          };
        }

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    const userId = formData.get('userId') as string;
    
    if (!userId) {
      return {
        success: false,
        error: 'L\'ID utilisateur est requis.',
      };
    }

    // Prevent self-deletion
    if (userId === currentUser.id) {
      return {
        success: false,
        error: 'Vous ne pouvez pas supprimer votre propre compte.',
      };
    }

    // Check if user exists and get their roles
    const userToDelete = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!userToDelete) {
      return {
        success: false,
        error: 'Utilisateur non trouvé.',
      };
    }

    // Prevent deletion of other admin users (optional security measure)
    const isOtherAdmin = userToDelete.userRoles.some(ur => ur.role.name === 'admin');
    if (isOtherAdmin) {
      return {
        success: false,
        error: 'Impossible de supprimer d\'autres comptes administrateur.',
      };
    }

    // Soft delete the user (set isActive to false)
    // Note: This is actually a deactivation, not a deletion
    // The user data is preserved but they cannot access the system
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    // Log the action
    logError(new Error('User deactivated'), {
      action: 'deleteUser',
      adminId: currentUser.id,
      adminEmail: currentUser.email,
      targetUserId: userId,
      targetUserEmail: userToDelete.email,
      method: 'softDelete',
    });

    return {
      success: true,
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
        error: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.',
        fieldErrors: {}
      };
    }

    // Handle permission/authorization errors
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      // This is a redirect error, likely due to permission issues
      return {
        success: false,
        error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
        fieldErrors: {}
      };
    }

    // Log and handle other errors
    logError(error as Error, { 
      action: 'deleteUser',
      userId: formData.get('userId'),
    });
    
    return {
      success: false,
              error: 'Une erreur inattendue s\'est produite lors de la suppression de l\'utilisateur. Veuillez réessayer.',
    };
  }
}
