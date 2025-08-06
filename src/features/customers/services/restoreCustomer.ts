import { prisma } from '@/lib/prisma';

export async function restoreCustomer(id: string) {
  try {
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });

    return { success: true, data: customer };
  } catch (error) {
    console.error('Error restoring customer:', error);
    return { success: false, error: 'Failed to restore customer' };
  }
} 