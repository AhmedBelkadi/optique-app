'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { logError } from '@/lib/errorHandling';
import { requirePermission } from '@/lib/auth/authorization';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/features/auth/services/session';

export async function updateUserStatusAction(prevState: any, formData: FormData): Promise<any> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('users', 'update');

    // Get current user for validation
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
    const isActive = formData.get('isActive') === 'true';

    if (!userId) {
      return {
        success: false,
        error: 'L\'ID utilisateur est requis',
      };
    }

    // Prevent admin from deactivating themselves
    if (userId === currentUser.id && !isActive) {
      return {
        success: false,
        error: 'Vous ne pouvez pas désactiver votre propre compte',
      };
    }

    // Update user status
    await prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });

    return {
      success: true,
      message: `Utilisateur ${isActive ? 'activé' : 'désactivé'} avec succès`,
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
      action: 'updateUserStatus',
      formData: {
        userId: formData.get('userId'),
        isActive: formData.get('isActive'),
      }
    });
    
    return {
      success: false,
              error: 'Une erreur inattendue s\'est produite lors de la mise à jour du statut utilisateur. Veuillez réessayer.',
    };
  }
}
