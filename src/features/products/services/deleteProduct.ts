import { prisma } from '@/lib/prisma';
import { sanitizeString } from '@/lib/shared/utils/sanitize';

export interface DeleteProductResult {
  success: boolean;
  error?: string;
}

export async function deleteProduct(id: string): Promise<DeleteProductResult> {
  try {
    // Sanitize the ID input
    const sanitizedId = sanitizeString(id);
    
    if (!sanitizedId) {
      return { success: false, error: 'Invalid product ID' };
    }

    const existingProduct = await prisma.product.findFirst({
      where: { id: sanitizedId, isDeleted: false },
    });
    if (!existingProduct) {
      return { success: false, error: 'Product not found or already deleted' };
    }
    await prisma.product.update({
      where: { id: sanitizedId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Error soft deleting product:', error);
    return { success: false, error: 'Failed to delete product' };
  }
} 