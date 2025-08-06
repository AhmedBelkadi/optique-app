'use server';

import { revalidatePath } from 'next/cache';
import { restoreCustomer } from '../services/restoreCustomer';

export async function restoreCustomerAction(id: string) {
  try {
    const result = await restoreCustomer(id);

    if (result.success) {
      revalidatePath('/admin/customers');
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error: any) {
    console.error('Error in restoreCustomerAction:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to restore customer' 
    };
  }
} 