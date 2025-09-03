import { prisma } from '@/lib/prisma';

export interface GetCustomerByIdResult {
  success: boolean;
  data?: any;
  error?: string;
}

export async function getCustomerById(id: string): Promise<GetCustomerByIdResult> {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      return {
        success: false,
        error: 'Customer not found',
      };
    }

    return {
      success: true,
      data: customer,
    };
  } catch (error) {
    console.error('Error fetching customer:', error);
    return {
      success: false,
      error: 'Failed to fetch customer',
    };
  }
}
