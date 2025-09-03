import { prisma } from '@/lib/prisma';
import { HomeValues, HomeValuesFormData, homeValuesFormSchema } from '../schema/homeValuesSchema';
import { validateAndSanitize } from '@/lib/shared/utils/sanitize';
import { logError } from '@/lib/errorHandling';

export interface CreateHomeValueResult {
  success: boolean;
  data?: HomeValues;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function createHomeValue(data: HomeValuesFormData): Promise<CreateHomeValueResult> {
  try {
    // Sanitize input first
    const sanitizedData = validateAndSanitize(data);
    
    // Validate sanitized input
    const validation = homeValuesFormSchema.safeParse(sanitizedData);
    if (!validation.success) {
      return {
        success: false,
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    const homeValue = await prisma.homeValues.create({
      data: {
        title: validation.data.title,
        description: validation.data.description,
        highlight: validation.data.highlight,
        icon: validation.data.icon,
        order: validation.data.order,
      },
    });

    return { success: true, data: homeValue };
  } catch (error) {
    logError(error as Error, { 
      action: 'createHomeValue', 
      data: { 
        title: data.title,
        description: data.description
      } 
    });
    
    // Check for specific database errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return {
          success: false,
          error: 'A value with this title already exists.',
        };
      }
    }
    
    return { success: false, error: 'Failed to create home value. Please try again.' };
  }
}

export async function getAllHomeValues(): Promise<{ success: boolean; data?: HomeValues[]; error?: string }> {
  try {
    const homeValues = await prisma.homeValues.findMany({
      orderBy: { order: 'asc' },
    });

    return { success: true, data: homeValues };
  } catch (error) {
    console.error('Error fetching home values:', error);
    return { success: false, error: 'Failed to fetch home values' };
  }
}

export async function getHomeValueById(id: string): Promise<{ success: boolean; data?: HomeValues; error?: string }> {
  try {
    const homeValue = await prisma.homeValues.findUnique({
      where: { id },
    });

    if (!homeValue) {
      return { success: false, error: 'Home value not found' };
    }

    return { success: true, data: homeValue };
  } catch (error) {
    console.error('Error fetching home value:', error);
    return { success: false, error: 'Failed to fetch home value' };
  }
}

export interface UpdateHomeValueResult {
  success: boolean;
  data?: HomeValues;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function updateHomeValue(id: string, data: Partial<HomeValuesFormData>): Promise<UpdateHomeValueResult> {
  try {
    // Sanitize input first
    const sanitizedData = validateAndSanitize(data);
    
    // Validate sanitized input (partial validation for updates)
    const validation = homeValuesFormSchema.partial().safeParse(sanitizedData);
    if (!validation.success) {
      return {
        success: false,
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    const homeValue = await prisma.homeValues.update({
      where: { id },
      data: {
        ...validation.data,
        updatedAt: new Date(),
      },
    });

    return { success: true, data: homeValue };
  } catch (error) {
    logError(error as Error, { 
      action: 'updateHomeValue', 
      id,
      data: { 
        title: data.title,
        description: data.description
      } 
    });
    
    // Check for specific database errors
    if (error instanceof Error) {
      if (error.message.includes('Record to update not found')) {
        return {
          success: false,
          error: 'Home value not found.',
        };
      }
    }
    
    return { success: false, error: 'Failed to update home value. Please try again.' };
  }
}

export async function deleteHomeValue(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.homeValues.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting home value:', error);
    return { success: false, error: 'Failed to delete home value' };
  }
}

export async function reorderHomeValues(ids: string[]): Promise<{ success: boolean; error?: string }> {
  try {
    const updates = ids.map((id, index) =>
      prisma.homeValues.update({
        where: { id },
        data: { order: index },
      })
    );

    await prisma.$transaction(updates);

    return { success: true };
  } catch (error) {
    console.error('Error reordering home values:', error);
    return { success: false, error: 'Failed to reorder home values' };
  }
}
