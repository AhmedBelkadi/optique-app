'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { logError } from '@/lib/errorHandling';
import { getCurrentUser } from '@/features/auth/services/session';
import { CreateUserState } from '@/types/api';
import { requirePermission } from '@/lib/auth/authorization';
import { createUserSchema, CreateUserInput, USER_CREATION_ERRORS } from '../schema/createUserSchema';
import { createUser } from '../services/createUserService';

export async function createUserAction(prevState: CreateUserState, formData: FormData): Promise<CreateUserState> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('users', 'create');

    // Get current user for role assignment
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        error: USER_CREATION_ERRORS.SESSION_NOT_FOUND,
        fieldErrors: {},
        values: { name: '', email: '', role: '', notes: '' },
      };
    }

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);
    
    // Extract and sanitize form data
    const rawData = {
      name: (formData.get('name') as string)?.trim() || '',
      email: (formData.get('email') as string)?.trim() || '',
      role: (formData.get('role') as string)?.trim() || '',
      notes: (formData.get('notes') as string)?.trim() || '',
    };

    // Validate input using Zod schema
    const validation = createUserSchema.safeParse(rawData);
    if (!validation.success) {
      return {
        success: false,
        error: USER_CREATION_ERRORS.VALIDATION_FAILED,
        fieldErrors: validation.error.flatten().fieldErrors,
        values: rawData,
      };
    }

    const validatedData = validation.data;

    // Create user using service layer
    const result = await createUser(validatedData, currentUser.id);

    if (result.success) {
      return {
        success: true,
        error: '',
        fieldErrors: {},
        values: {
          name: validatedData.name,
          email: validatedData.email,
          role: validatedData.role,
          notes: validatedData.notes || '',
        },
        userId: result.data?.user.id,
        warning: result.warning,
      };
    } else {
      return {
        success: false,
        error: result.error || USER_CREATION_ERRORS.USER_CREATION_FAILED,
        fieldErrors: result.fieldErrors || {},
        values: rawData,
      };
    }

  } catch (error) {
    // Handle rate limiting errors
    if (error instanceof Error && error.name === 'RateLimitError') {
      return {
        success: false,
        error: USER_CREATION_ERRORS.RATE_LIMIT_EXCEEDED,
        fieldErrors: {},
        values: {
          name: (formData.get('name') as string) || '',
          email: (formData.get('email') as string) || '',
          role: (formData.get('role') as string) || '',
          notes: (formData.get('notes') as string) || '',
        },
      };
    }
    
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        success: false,
        error: USER_CREATION_ERRORS.CSRF_ERROR,
        fieldErrors: {},
        values: {
          name: '',
          email: '',
          role: '',
          notes: ''
        }
      };
    }

    // Handle permission/authorization errors
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      return {
        success: false,
        error: USER_CREATION_ERRORS.PERMISSION_DENIED,
        fieldErrors: {},
        values: {
          name: '',
          email: '',
          role: '',
          notes: ''
        }
      };
    }

    // Log and handle other errors
    logError(error as Error, { 
      action: 'createUserAction',
      formData: {
        name: formData.get('name'),
        email: formData.get('email'),
        role: formData.get('role'),
        notes: formData.get('notes'),
      }
    });
    
    return {
      success: false,
      error: USER_CREATION_ERRORS.UNEXPECTED_ERROR,
      fieldErrors: {},
      values: {
        name: (formData.get('name') as string) || '',
        email: (formData.get('email') as string) || '',
        role: (formData.get('role') as string) || '',
        notes: (formData.get('notes') as string) || '',
      },
    };
  }
}

