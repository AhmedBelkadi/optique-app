import { prisma } from '@/lib/prisma';
import { CreateCustomerInput } from '../schema/customerSchema';

export async function createCustomer(data: CreateCustomerInput) {
  try {
    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        notes: data.notes,
      },
    });

    return { success: true, data: customer };
  } catch (error) {
    console.error('Error creating customer:', error);
    return { success: false, error: 'Failed to create customer' };
  }
} 