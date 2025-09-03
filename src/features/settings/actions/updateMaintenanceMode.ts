'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { upsertOperationalSettings } from '@/features/settings/services/operationalSettings';
import { requirePermission } from '@/lib/auth/authorization';

export async function updateMaintenanceModeAction(prevState: any, formData: FormData): Promise<any> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('settings', 'update');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);
    
    // Extract maintenance mode value from form data
    const maintenanceMode = formData.get('maintenanceMode');
    
    // Validate the input
    if (maintenanceMode === null) {
      return {
        success: false,
        error: 'Maintenance mode value is required',
      };
    }
    
    // Convert string to boolean
    const isMaintenanceMode = maintenanceMode === 'true' || maintenanceMode === '1';
    
    // Update maintenance mode using the existing operational settings service
    const result = await upsertOperationalSettings({ maintenanceMode: isMaintenanceMode });
    
    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to update maintenance mode',
      };
    }
    
    return {
      success: true,
      message: `Maintenance mode ${isMaintenanceMode ? 'enabled' : 'disabled'} successfully`,
      data: result.data,
    };
  } catch (error) {
    console.error('Error in updateMaintenanceModeAction:', error);
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        success: false,
        error: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.',
        message: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.'
      };
    }

    // Handle permission/authorization errors
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      // This is a redirect error, likely due to permission issues
      return {
        success: false,
        error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
        message: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.'
      };
    }
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}