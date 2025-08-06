import { prisma } from '@/lib/prisma';
import { UpdateCustomerInput } from '../schema/customerSchema';

export async function updateCustomer(id: string, data: UpdateCustomerInput) {
  try {
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        notes: data.notes,
        updatedAt: new Date(),
      },
    });

    return { success: true, data: customer };
  } catch (error) {
    console.error('Error updating customer:', error);
    return { success: false, error: 'Failed to update customer' };
  }
} 