import { prisma } from '@/lib/prisma';

export async function getCustomerById(id: string) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        appointments: {
          orderBy: { startTime: 'desc' },
          where: { isDeleted: false },
        },
        _count: {
          select: {
            appointments: true,
          },
        },
      },
    });

    if (!customer) {
      return { success: false, error: 'Customer not found' };
    }

    return { success: true, data: customer };
  } catch (error) {
    console.error('Error getting customer:', error);
    return { success: false, error: 'Failed to get customer' };
  }
} 