import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/shared/utils/crypto';
import { authSchema } from '../schema/authSchema';
import { sanitizeString, sanitizeEmail } from '@/lib/shared/utils/sanitize';

export interface RegisterResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export async function registerUser(name: string, email: string, password: string, confirmPassword: string): Promise<RegisterResult> {
  try {
    // Sanitize inputs first
    const sanitizedName = sanitizeString(name);
    const sanitizedEmail = sanitizeEmail(email);
    
    // Validate sanitized input
    const validation = authSchema.register.safeParse({
      name: sanitizedName,
      email: sanitizedEmail,
      password,
      confirmPassword,
    });
    
    if (!validation.success) {
      return {
        success: false,
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (existingUser) {
      return {
        success: false,
        error: 'User with this email already exists',
      };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during registration',
    };
  }
} 