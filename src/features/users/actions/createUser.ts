'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/shared/utils/crypto';
import { logError } from '@/lib/errorHandling';
import { getCurrentUser } from '@/features/auth/services/session';
import { assignRoleToUser, getRoleByName } from '@/features/auth/services/roleService';
import { sendUserCredentialsEmail } from '@/lib/shared/services/emailService';
import { CreateUserState } from '@/types/api';
import { requirePermission } from '@/lib/auth/authorization';

export async function createUserAction(prevState: CreateUserState, formData: FormData): Promise<CreateUserState> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('users', 'create');

    // Get current user for role assignment
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        error: 'User session not found. Please log in again.',
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
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const role = formData.get('role') as string;
    const notes = formData.get('notes') as string;

    // Validate input
    if (!name || !email || !role) {
      return {
        success: false,
        error: 'Name, email, and role are required',
        fieldErrors: {},
        values: { name, email, role, notes },
      };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: 'User with this email already exists',
        fieldErrors: {},
        values: { name, email, role, notes },
      };
    }

    // Get role
    const roleRecord = await getRoleByName(role);
    if (!roleRecord) {
      return {
        success: false,
        error: 'Invalid role specified',
        fieldErrors: {},
        values: { name, email, role, notes },
      };
    }

    // Generate a secure password
    const password = generateSecurePassword();
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isActive: true,
      },
    });

    // Assign role to user
    await assignRoleToUser({
      userId: user.id,
      roleId: roleRecord.id,
      assignedBy: currentUser.id,
    });

    // Send email with credentials
    const emailResult = await sendUserCredentialsEmail({
      to: email,
      name,
      email,
      password,
      role,
    });

    if (!emailResult.success) {
      // Log the error but don't fail the user creation
      logError(new Error(emailResult.error), {
        action: 'createUser',
        step: 'emailSending',
        userId: user.id,
        email,
      });
      
      // Return success but with a warning about email
      return {
        success: true,
        error: '',
        fieldErrors: {},
        values: {
          name: name,
          email: email,
          role: role,
          notes: notes,
        },
        userId: user.id,
        warning: 'Utilisateur créé avec succès, mais l\'envoi de l\'email avec les identifiants a échoué. Veuillez contacter l\'utilisateur directement.',
      };
    }

    return {
      success: true,
      error: '',
      fieldErrors: {},
      values: {
        name: name,
        email: email,
        role: role,
        notes: notes,
      },
      userId: user.id,
    };
  } catch (error) {
    // Handle rate limiting errors
    if (error instanceof Error && error.name === 'RateLimitError') {
      return {
        success: false,
        error: error.message,
        fieldErrors: {},
        values: {
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          role: formData.get('role') as string,
          notes: formData.get('notes') as string,
        },
      };
    }
    
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        success: false,
        error: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.',
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
      // This is a redirect error, likely due to permission issues
      return {
        success: false,
        error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
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
      action: 'createUser',
      formData: {
        name: formData.get('name'),
        email: formData.get('email'),
        role: formData.get('role'),
        notes: formData.get('notes'),
      }
    });
    
    return {
      success: false,
      error: 'An unexpected error occurred while creating the user. Please try again.',
      fieldErrors: {},
      values: {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        role: formData.get('role') as string,
        notes: formData.get('notes') as string,
      },
    };
  }
}

// Generate a secure password
function generateSecurePassword(): string {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one character from each category
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Uppercase
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Lowercase
  password += '0123456789'[Math.floor(Math.random() * 10)]; // Number
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // Special character
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}
