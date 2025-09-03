import { prisma } from '@/lib/prisma';

export async function getActiveBanner(): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const now = new Date();
    
    const activeBanner = await prisma.banner.findFirst({
      where: {
        isActive: true,
        startDate: {
          lte: now,
        },
        endDate: {
          gte: now,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: activeBanner,
    };
  } catch (error) {
    console.error('Error fetching active banner:', error);
    return {
      success: false,
      error: 'Failed to fetch active banner',
    };
  }
} 