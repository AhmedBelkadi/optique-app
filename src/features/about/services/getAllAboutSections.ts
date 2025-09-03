import { prisma } from '@/lib/prisma';
import { aboutSectionSchema } from '../schema/aboutSectionSchema';

export async function getAllAboutSections() {
  try {
    const aboutSections = await prisma.aboutSection.findMany({
      orderBy: { order: 'asc' }
    });

    const validatedData = aboutSections.map(section => 
      aboutSectionSchema.parse(section)
    );

    return {
      success: true,
      data: validatedData,
      message: 'About sections retrieved successfully'
    };
  } catch (error) {
    console.error('Error fetching about sections:', error);
    return {
      success: false,
      data: [],
      message: 'Failed to fetch about sections'
    };
  }
}
