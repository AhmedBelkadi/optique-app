'use server';

import { revalidatePath } from 'next/cache';
import { createCustomer } from '../services/createCustomer';
import { CreateCustomerInput } from '../schema/customerSchema';

export async function createCustomerAction(data: CreateCustomerInput) {
  try {
    const result = await createCustomer(data);

    if (result.success) {
      revalidatePath('/admin/customers');
      return {
        success: true,
        message: 'Customer created successfully',
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: result.error || 'Failed to create customer',
      };
    }
  } catch (error) {
    console.error('Error in createCustomerAction:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
} 