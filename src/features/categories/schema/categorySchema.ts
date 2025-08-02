import { z } from 'zod';
import { VALIDATION_CONSTANTS, ERROR_MESSAGES } from '@/lib/shared/constants'; // adjust path if needed


const { categories } = VALIDATION_CONSTANTS;
const { validation } = ERROR_MESSAGES;

export const categorySchema = {
  create: z.object({
    name: z
      .string()
      .min(
        categories.name.minLength,
        validation.minLength(categories.name.minLength)
      )
      .max(
        categories.name.maxLength,
        validation.maxLength(categories.name.maxLength)
      ),
    description: z
      .string()
      .max(
        categories.description.maxLength,
        validation.maxLength(categories.description.maxLength)
      )
      .optional(),
    image: z.string().optional(),
  }),

  update: z.object({
    name: z
      .string()
      .min(
        categories.name.minLength,
        validation.minLength(categories.name.minLength)
      )
      .max(
        categories.name.maxLength,
        validation.maxLength(categories.name.maxLength)
      )
      .optional(),
    description: z
      .string()
      .max(
        categories.description.maxLength,
        validation.maxLength(categories.description.maxLength)
      )
      .optional(),
    image: z.string().optional(),
  }),

  category: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    image: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
    isDeleted: z.boolean(),
  }),
};

export type Category = z.infer<typeof categorySchema.category>;
export type CategoryCreateInput = z.infer<typeof categorySchema.create>;
export type CategoryUpdateInput = z.infer<typeof categorySchema.update>;
