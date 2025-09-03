import { prisma } from '@/lib/prisma';
import { aboutBenefitSchema } from '../schema/aboutBenefitSchema';

export async function getAboutBenefits() {
  try {
    let benefits = await prisma.aboutBenefit.findMany({
      orderBy: { order: 'asc' }
    });

    const validatedData = benefits.map(benefit => 
      aboutBenefitSchema.parse(benefit)
    );

    return {
      success: true,
      data: validatedData,
      message: 'About benefits retrieved successfully'
    };
  } catch (error) {
    console.error('Error fetching about benefits:', error);
    return {
      success: false,
      data: [],
      message: 'Failed to fetch about benefits'
    };
  }
}
