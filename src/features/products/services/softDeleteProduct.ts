import { prisma } from '@/lib/prisma';

export async function softDeleteProduct(productId: string) {
  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        deletedAt: new Date(),
        isDeleted: true,
      },
    });

    return { success: true, data: product };
  } catch (error: any) {
    if (error.code === 'P2025') {
      return { success: false, error: 'Product not found.' };
    }
    
    console.error('Error soft deleting product:', error);
    return { success: false, error: 'Failed to delete product.' };
  }
} 