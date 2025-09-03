'use server';

import { requirePermission } from '@/lib/auth/authorization';
import { getAllFAQs } from '../services/getAllFAQs';

export async function getAllFAQsAction() {
  try {
    // 🔐 AUTHENTICATION CHECK - Ensure user has permission
    await requirePermission('faqs', 'read');

    return await getAllFAQs();
  } catch (error) {
    console.error('Error in getAllFAQsAction:', error);
    return {
      success: false,
      error: 'Erreur lors de la récupération des FAQs'
    };
  }
}
