'use server';

import { revalidatePath } from 'next/cache';
import { softDeleteCustomer } from '../services/softDeleteCustomer';

export async function softDeleteCustomerAction(id: string) {
  try {
    const result = await softDeleteCustomer(id);

    if (result.success) {
      revalidatePath('/admin/customers');
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error: any) {
    console.error('Error in softDeleteCustomerAction:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to delete customer' 
    };
  }
} 