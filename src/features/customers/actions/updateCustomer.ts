'use server';

import { revalidatePath } from 'next/cache';
import { updateCustomer } from '../services/updateCustomer';
import { UpdateCustomerInput } from '../schema/customerSchema';

export async function updateCustomerAction(id: string, data: UpdateCustomerInput) {
  try {
    const result = await updateCustomer(id, data);

    if (result.success) {
      revalidatePath('/admin/customers');
      revalidatePath(`/admin/customers/${id}`);
      return {
        success: true,
        message: 'Customer updated successfully',
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: result.error || 'Failed to update customer',
      };
    }
  } catch (error) {
    console.error('Error in updateCustomerAction:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
} 