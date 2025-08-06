import { prisma } from '@/lib/prisma';
import { Category } from '@/features/categories/schema/categorySchema';

export const getAllCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Transform to match Category schema
    const transformedCategories: Category[] = categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      image: category.image,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      deletedAt: category.deletedAt,
      isDeleted: category.isDeleted,
      
    }));

    return { success: true, data: transformedCategories };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { success: false, error: 'Failed to fetch categories.' };
  }
}; 