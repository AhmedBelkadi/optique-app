import { prisma } from '@/lib/prisma';

export async function getAllBanners(): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: banners,
    };
  } catch (error) {
    console.error('Error fetching banners:', error);
    return {
      success: false,
      error: 'Failed to fetch banners',
    };
  }
} 