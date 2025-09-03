import { prisma } from '@/lib/prisma';
import { CategoryUpdateInput } from '@/features/categories/schema/categorySchema';

export async function updateCategory(id: string, data: CategoryUpdateInput) {
  try {
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
      },
    });

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