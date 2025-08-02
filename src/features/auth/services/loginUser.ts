import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/shared/utils/crypto';
import { createSession } from './session';
import { authSchema } from '../schema/authSchema';
import { sanitizeEmail } from '@/lib/shared/utils/sanitize';

export interface LoginResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export async function loginUser(email: string, password: string): Promise<LoginResult> {
  try {
    // Sanitize email input
    const sanitizedEmail = sanitizeEmail(email);
    
    // Validate sanitized input
    const validation = authSchema.login.safeParse({ 
      email: sanitizedEmail, 
      password 
    });
    if (!validation.success) {
      return {
        success: false,
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    // Create session
    await createSession(user.id);

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during login',
    };
  }
} 