import { prisma } from '@/lib/prisma';
import { CreateBanner } from '../schema/bannerSchema';

export interface CreateBannerResult {
  success: boolean;
  data?: any;
  error?: string;
}

export async function createBanner(data: CreateBanner): Promise<CreateBannerResult> {
  try {
    // Validate that end date is after start date
    if (data.endDate <= data.startDate) {
      return {
        success: false,
        error: 'End date must be after start date',
      };
    }

    // Check for date conflicts with existing active banners
    const conflictingBanner = await prisma.banner.findFirst({
      where: {
        isActive: true,
        OR: [
          {
            AND: [
              { startDate: { lte: data.endDate } },
              { endDate: { gte: data.startDate } }
            ]
          }
        ]
      },
    });

    if (conflictingBanner) {
      return {
        success: false,
        error: 'This banner conflicts with an existing active banner. Please adjust the dates.',
      };
    }

    // Create banner
    const banner = await prisma.banner.create({
      data: {
        text: data.text,
        startDate: data.startDate,
        endDate: data.endDate,
        isActive: data.isActive,
      },
    });

    return {
      success: true,
      data: banner,
    };

  } catch (error) {
    console.error('Error creating banner:', error);
    return {
      success: false,
      error: 'Failed to create banner. Please try again.',
    };
  }
} 