import { z } from 'zod';
import { VALIDATION_CONSTANTS, ERROR_MESSAGES } from '@/lib/shared/constants'; // adjust path if needed

const { products } = VALIDATION_CONSTANTS;
const { validation, products: productErrors } = ERROR_MESSAGES;

export const productSchema = {
  create: z.object({
    name: z
      .string()
      .min(products.name.minLength, validation.required)
      .max(products.name.maxLength, validation.maxLength(products.name.maxLength)),
    description: z
      .string()
      .min(products.description.minLength, validation.required)
      .max(products.description.maxLength, validation.maxLength(products.description.maxLength)),
    price: z
      .number({ invalid_type_error: validation.required })
      .positive(validation.positive)
      .max(products.price.max, validation.maxValue(products.price.max)),
    brand: z
      .string()
      .max(products.brand.maxLength, validation.maxLength(products.brand.maxLength))
      .optional(),
    reference: z
      .string()
      .max(products.reference.maxLength, validation.maxLength(products.reference.maxLength))
      .optional(),
    categoryIds: z
      .array(z.string())
      .min(1, productErrors.atLeastOneCategory),
  }),

  update: z.object({
    name: z
      .string()
      .min(products.name.minLength, validation.required)
      .max(products.name.maxLength, validation.maxLength(products.name.maxLength))
      .optional(),
    description: z
      .string()
      .min(products.description.minLength, validation.required)
      .max(products.description.maxLength, validation.maxLength(products.description.maxLength))
      .optional(),
    price: z
      .number()
      .positive(validation.positive)
      .max(products.price.max, validation.maxValue(products.price.max))
      .optional(),
    brand: z
      .string()
      .max(products.brand.maxLength, validation.maxLength(products.brand.maxLength))
      .optional(),
    reference: z
      .string()
      .max(products.reference.maxLength, validation.maxLength(products.reference.maxLength))
      .optional(),
    categoryIds: z
      .array(z.string())
      .min(1, productErrors.atLeastOneCategory)
      .optional(),
  }),

  product: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    brand: z.string().nullable(),
    reference: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    deletedAt: z.date().nullable(),
    isDeleted: z.boolean(),
    categories: z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable(),
    })),
    images: z.array(z.object({
      id: z.string(),
      filename: z.string(),
      path: z.string(),
      alt: z.string().nullable(),
      order: z.number(),
    })),
  }),
};

export type CreateProductInput = z.infer<typeof productSchema.create>;
export type UpdateProductInput = z.infer<typeof productSchema.update> & {
  keepImageIds?: string[];
  newImages?: File[];
};
export type Product = z.infer<typeof productSchema.product>;
