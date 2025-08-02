'use server';

import { loginUser } from '@/features/auth/services/loginUser';
import { LoginState } from '@/types/api';


export async function loginAction(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const result = await loginUser(email, password);

    if (result.success) {
      return {
        error: '',
        fieldErrors: {},
        values: {
          email: '',
        },
        success: true,
      };
    } else {
      return {
        error: result.error || 'Login failed',
        fieldErrors: result.fieldErrors,
        values: {
          email,
        },
      };
    }
  } catch (error) {
    console.error('Login action error:', error);
    return {
      error: 'An unexpected error occurred during login',
      values: {
        email,
      },
    };
  }
} 