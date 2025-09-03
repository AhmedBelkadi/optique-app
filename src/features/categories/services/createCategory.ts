import { prisma } from '@/lib/prisma';
import { CategoryCreateInput } from '@/features/categories/schema/categorySchema';

export async function createCategory(data: CategoryCreateInput) {
  try {
    const category = await prisma.category.create({
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
    
    console.error('Error creating category:', error);
    return { success: false, error: 'Échec de la création de la catégorie.' };
  }
} 