import { prisma } from '@/lib/prisma';
import { UpdateBanner } from '../schema/bannerSchema';

export interface UpdateBannerResult {
  success: boolean;
  data?: any;
  error?: string;
}

export async function updateBanner(id: string, data: UpdateBanner): Promise<UpdateBannerResult> {
  try {
    // Check if banner exists
    const existingBanner = await prisma.banner.findFirst({
      where: { id },
    });

    if (!existingBanner) {
      return {
        success: false,
        error: 'Banner not found',
      };
    }

    // If dates are provided, validate that end date is after start date
    if (data.endDate && data.startDate && data.endDate <= data.startDate) {
      return {
        success: false,
        error: 'End date must be after start date',
      };
    }

    // Check for date conflicts with other active banners
    if (data.startDate && data.endDate) {
      const conflictingBanner = await prisma.banner.findFirst({
        where: {
          id: { not: id },
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
    }

    // Prepare update data
    const updateData: any = {};
    
    if (data.text !== undefined) updateData.text = data.text;
    if (data.startDate !== undefined) updateData.startDate = data.startDate;
    if (data.endDate !== undefined) updateData.endDate = data.endDate;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    // Update banner
    const updatedBanner = await prisma.banner.update({
      where: { id },
      data: updateData,
    });

    return {
      success: true,
      data: updatedBanner,
    };

  } catch (error) {
    console.error('Error updating banner:', error);
    return {
      success: false,
      error: 'Failed to update banner. Please try again.',
    };
  }
} 