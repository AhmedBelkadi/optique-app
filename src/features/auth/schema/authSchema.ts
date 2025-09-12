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
      .min(1, "Password is required"),
  }),

  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    roles: z.array(z.string()),
    isAdmin: z.boolean(),
    isStaff: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),

  forgotPassword: z.object({
    email: z
      .string()
      .email(ERROR_MESSAGES.validation.email)
      .max(
        VALIDATION_CONSTANTS.auth.email.maxLength,
        ERROR_MESSAGES.validation.maxLength(VALIDATION_CONSTANTS.auth.email.maxLength)
      ),
  }),

  resetPassword: z.object({
    token: z.string().min(1, 'Reset token is required'),
    password: z
      .string()
      .min(
        VALIDATION_CONSTANTS.auth.password.minLength,
        ERROR_MESSAGES.validation.minLength(VALIDATION_CONSTANTS.auth.password.minLength)
      )
      .max(
        VALIDATION_CONSTANTS.auth.password.maxLength,
        ERROR_MESSAGES.validation.maxLength(VALIDATION_CONSTANTS.auth.password.maxLength)
      )
      .refine(
        (password) => /[A-Z]/.test(password),
        "Le mot de passe doit contenir au moins une lettre majuscule"
      )
      .refine(
        (password) => /[a-z]/.test(password),
        "Le mot de passe doit contenir au moins une lettre minuscule"
      )
      .refine(
        (password) => /[0-9]/.test(password),
        "Le mot de passe doit contenir au moins un chiffre"
      )
      .refine(
        (password) => /[^A-Za-z0-9]/.test(password),
        "Le mot de passe doit contenir au moins un caractère spécial"
      ),
    confirmPassword: z.string(),
  }).refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }
  ),
};

export type LoginInput = z.infer<typeof authSchema.login>;
export type User = z.infer<typeof authSchema.user>;
export type ForgotPasswordInput = z.infer<typeof authSchema.forgotPassword>;
export type ResetPasswordInput = z.infer<typeof authSchema.resetPassword>;
