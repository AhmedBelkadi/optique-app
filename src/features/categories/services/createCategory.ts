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
      return { success: false, error: 'A category with this name already exists.' };
    }
    
    console.error('Error creating category:', error);
    return { success: false, error: 'Failed to create category.' };
  }
} 