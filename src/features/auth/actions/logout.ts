'use server';

import { destroySession } from '@/features/auth/services/session';
import { LogoutState } from '@/types/api';


export async function logoutAction(_prevState: LogoutState, _formData: FormData): Promise<LogoutState> {
  try {
    await destroySession();
    return {
      success: true,
      error: '',
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during logout',
    };
  }
} 