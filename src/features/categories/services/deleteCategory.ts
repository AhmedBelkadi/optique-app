import { prisma } from '@/lib/prisma';

export async function deleteCategory(id: string) {
  try {
    // Check if category is used by any products
    const productsCount = await prisma.productCategory.count({
      where: { categoryId: id },
    });

    if (productsCount > 0) {
      return { 
        success: false, 
        error: `Impossible de supprimer la catégorie. Elle est utilisée par ${productsCount} produit(s).` 
      };
    }

    // Soft delete the category
    const category = await prisma.category.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isDeleted: true,
      },
    });

    return { success: true, data: category };
  } catch (error: any) {
    if (error.code === 'P2025') {
      return { success: false, error: 'Catégorie non trouvée.' };
    }
    
    console.error('Error deleting category:', error);
    return { success: false, error: 'Échec de la suppression de la catégorie.' };
  }
} 