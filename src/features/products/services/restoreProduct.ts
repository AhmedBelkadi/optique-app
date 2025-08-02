import { prisma } from '@/lib/prisma';
import { sanitizeString } from '@/lib/shared/utils/sanitize';

export interface RestoreProductResult {
  success: boolean;
  error?: string;
}

export async function restoreProduct(id: string): Promise<RestoreProductResult> {
  try {
    // Sanitize the ID input
    const sanitizedId = sanitizeString(id);
    
    if (!sanitizedId) {
      return { success: false, error: 'Invalid product ID' };
    }

    const existingProduct = await prisma.product.findFirst({
      where: { id: sanitizedId, isDeleted: true }, // Check if product exists and is deleted
    });
    if (!existingProduct) {
      return { success: false, error: 'Product not found or not deleted' };
    }
    await prisma.product.update({
      where: { id: sanitizedId },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Error restoring product:', error);
    return { success: false, error: 'Failed to restore product' };
  }
} 