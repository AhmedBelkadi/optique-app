'use server';

import { getAllCustomers } from '../services/getAllCustomers';

export async function getAllCustomersAction(params: {
  search?: string;
  isDeleted?: boolean;
  sortBy?: 'name' | 'email' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}) {
  try {
    const result = await getAllCustomers(params);
    return result;
  } catch (error) {
    console.error('Error in getAllCustomersAction:', error);
    return { success: false, error: 'Failed to get customers' };
  }
} 