'use server';

import { registerUser } from '@/features/auth/services/registerUser';
import { RegisterState } from '@/types/api';

export async function registerAction(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  try {
    const result = await registerUser(name, email, password, confirmPassword);

    if (result.success) {
      return {
        error: '',
        fieldErrors: {},
        values: {
          name: '',
          email: '',
        },
        success: true,
      };
    } else {
      return {
        error: result.error || 'Registration failed',
        fieldErrors: result.fieldErrors,
        values: {
          name,
          email,
        },
      };
    }
  } catch (error) {
    console.error('Register action error:', error);
    return {
      error: 'An unexpected error occurred during registration',
      values: {
        name,
        email,
      },
    };
  }
} 