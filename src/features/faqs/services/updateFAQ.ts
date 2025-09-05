import { prisma } from '@/lib/prisma';
import { faqFormSchema } from '@/features/faqs/schema/faqSchema';
import { logError } from '@/lib/errorHandling';

export interface UpdateFAQInput {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface UpdateFAQResult {
  success: boolean;
  data?: any;
  error?: string;
}

export async function updateFAQ(input: UpdateFAQInput): Promise<UpdateFAQResult> {
  try {
    // Validate input
    const validatedData = faqFormSchema.parse({
      question: input.question,
      answer: input.answer,
      order: input.order,
    });

    // Update FAQ in database
    const updatedFAQ = await prisma.fAQ.update({
      where: { id: input.id },
      data: {
        question: validatedData.question,
        answer: validatedData.answer,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      data: updatedFAQ,
    };
  } catch (error) {
    logError(error as Error, {
      action: 'updateFAQ',
      input,
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update FAQ',
    };
  }
}
