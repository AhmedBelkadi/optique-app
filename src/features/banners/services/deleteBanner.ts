import { prisma } from '@/lib/prisma';

export async function deleteBanner(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await prisma.banner.delete({
      where: { id },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting banner:', error);
    
    // Handle Prisma-specific errors
    if (error instanceof Error) {
      if (error.message.includes('Record to delete does not exist')) {
        return {
          success: false,
          error: 'Banner not found or already deleted',
        };
      }
      if (error.message.includes('Foreign key constraint')) {
        return {
          success: false,
          error: 'Cannot delete banner - it is being used elsewhere',
        };
      }
    }
    
    return {
      success: false,
      error: 'Failed to delete banner. Please try again.',
    };
  }
} 