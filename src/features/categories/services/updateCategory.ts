import { prisma } from '@/lib/prisma';
import { CategoryUpdateInput } from '@/features/categories/schema/categorySchema';
import { deleteImage } from '@/lib/shared/utils/imageUploadUtils';

export async function updateCategory(id: string, data: CategoryUpdateInput) {
  try {
    // Get existing category to check for old image
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      select: { image: true }
    });

    if (!existingCategory) {
      return { success: false, error: 'Catégorie non trouvée.' };
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
      },
    });

    // Clean up old image if it was replaced
    if (existingCategory.image && data.image && existingCategory.image !== data.image) {
      await deleteImage(existingCategory.image);
    }

    return { success: true, data: category };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: 'Une catégorie avec ce nom existe déjà.' };
    }
    
    if (error.code === 'P2025') {
      return { success: false, error: 'Catégorie non trouvée.' };
    }
    
    console.error('Error updating category:', error);
    return { success: false, error: 'Échec de la mise à jour de la catégorie.' };
  }
} 