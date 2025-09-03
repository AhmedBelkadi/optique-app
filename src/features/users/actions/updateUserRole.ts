'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { logError } from '@/lib/errorHandling';
import { requirePermission } from '@/lib/auth/authorization';
import { prisma } from '@/lib/prisma';
import { assignRoleToUser, getRoleById } from '@/features/auth/services/roleService';
import { getCurrentUser } from '@/features/auth/services/session';

export async function updateUserRoleAction(prevState: any, formData: FormData): Promise<any> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('users', 'update');

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
    const role = formData.get('role') as string;

    if (!userId || !role) {
      return {
        success: false,
        error: 'L\'ID utilisateur et le rôle sont requis',
      };
    }

    // Get the role record by ID
    const roleRecord = await getRoleById(role);
    if (!roleRecord) {
      return {
        success: false,
        error: 'Rôle spécifié invalide',
      };
    }

    // Remove all existing roles from the user
    await prisma.userRole.deleteMany({
      where: { userId },
    });

    // Assign the new role
    await assignRoleToUser({
      userId,
      roleId: roleRecord.id,
      assignedBy: currentUser.id,
    });

    return {
      success: true,
      message: 'Rôle utilisateur mis à jour avec succès',
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
      action: 'updateUserRole',
      formData: {
        userId: formData.get('userId'),
        role: formData.get('role'),
      }
    });
    
    return {
      success: false,
              error: 'Une erreur inattendue s\'est produite lors de la mise à jour du rôle utilisateur. Veuillez réessayer.',
    };
  }
}
