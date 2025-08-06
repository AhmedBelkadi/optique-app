import { prisma } from '@/lib/prisma';

export async function softDeleteCustomer(id: string) {
  try {
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return { success: true, data: customer };
  } catch (error) {
    console.error('Error soft deleting customer:', error);
    return { success: false, error: 'Failed to delete customer' };
  }
} 