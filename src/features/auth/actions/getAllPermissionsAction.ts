'use server';

import { requirePermission } from '@/lib/auth/authorization';
import { getAllPermissions } from '../services/roleService';

export async function getAllPermissionsAction() {
  try {
    // 🔐 AUTHENTICATION CHECK - Ensure user has permission
    requirePermission('permissions', 'read');

    const permissions = await getAllPermissions();
    return permissions;
  } catch (error) {
    console.error('Error in getAllPermissionsAction:', error);
    throw new Error('Erreur lors de la récupération des permissions');
  }
}
