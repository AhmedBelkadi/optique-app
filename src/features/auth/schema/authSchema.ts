import { z } from 'zod';
import { VALIDATION_CONSTANTS, ERROR_MESSAGES } from '@/lib/shared/constants'; // adjust path if needed

export const authSchema = {
  login: z.object({
    email: z
      .string()
      .email(ERROR_MESSAGES.validation.email)
      .max(
        VALIDATION_CONSTANTS.auth.email.maxLength,
        ERROR_MESSAGES.validation.maxLength(VALIDATION_CONSTANTS.auth.email.maxLength)
      ),
    password: z
      .string()
      .min(
        VALIDATION_CONSTANTS.auth.password.minLength,
        ERROR_MESSAGES.validation.minLength(VALIDATION_CONSTANTS.auth.password.minLength)
      )
      .max(
        VALIDATION_CONSTANTS.auth.password.maxLength,
        ERROR_MESSAGES.validation.maxLength(VALIDATION_CONSTANTS.auth.password.maxLength)
      ),
  }),

  register: z
    .object({
      name: z
        .string()
        .min(
          VALIDATION_CONSTANTS.auth.name.minLength,
          ERROR_MESSAGES.validation.minLength(VALIDATION_CONSTANTS.auth.name.minLength)
        )
        .max(
          VALIDATION_CONSTANTS.auth.name.maxLength,
          ERROR_MESSAGES.validation.maxLength(VALIDATION_CONSTANTS.auth.name.maxLength)
        ),
      email: z
        .string()
        .email(ERROR_MESSAGES.validation.email)
        .max(
          VALIDATION_CONSTANTS.auth.email.maxLength,
          ERROR_MESSAGES.validation.maxLength(VALIDATION_CONSTANTS.auth.email.maxLength)
        ),
      password: z
        .string()
        .min(
          VALIDATION_CONSTANTS.auth.password.minLength,
          ERROR_MESSAGES.validation.minLength(VALIDATION_CONSTANTS.auth.password.minLength)
        )
        .max(
          VALIDATION_CONSTANTS.auth.password.maxLength,
          ERROR_MESSAGES.validation.maxLength(VALIDATION_CONSTANTS.auth.password.maxLength)
        ),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: ERROR_MESSAGES.auth.passwordsDontMatch,
      path: ['confirmPassword'],
    }),

  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
};

export type LoginInput = z.infer<typeof authSchema.login>;
export type RegisterInput = z.infer<typeof authSchema.register>;
export type User = z.infer<typeof authSchema.user>;
