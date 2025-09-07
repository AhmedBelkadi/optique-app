import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/shared/utils/crypto';
import { logError } from '@/lib/errorHandling';
import { assignRoleToUser, getRoleByName } from '@/features/auth/services/roleService';
import { sendUserCredentialsEmail } from '@/lib/shared/services/emailService';
import { CreateUserInput, USER_CREATION_ERRORS } from '../schema/createUserSchema';

export interface CreateUserResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      isActive: boolean;
      createdAt: Date;
    };
    role: {
      id: string;
      name: string;
    };
  };
  warning?: string;
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

export async function createUser(
  userData: CreateUserInput,
  createdBy: string
): Promise<CreateUserResult> {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      return {
        success: false,
        error: USER_CREATION_ERRORS.EMAIL_ALREADY_EXISTS,
        fieldErrors: {
          email: [USER_CREATION_ERRORS.EMAIL_ALREADY_EXISTS]
        }
      };
    }

    // Get role
    const roleRecord = await getRoleByName(userData.role);
    if (!roleRecord) {
      return {
        success: false,
        error: USER_CREATION_ERRORS.INVALID_ROLE,
        fieldErrors: {
          role: [USER_CREATION_ERRORS.INVALID_ROLE]
        }
      };
    }

    // Generate a secure password
    const password = generateSecurePassword();
    const hashedPassword = await hashPassword(password);

    // Create user and assign role in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          isActive: true,
        },
      });

      // Assign role to user
      await tx.userRole.create({
        data: {
          userId: user.id,
          roleId: roleRecord.id,
          assignedBy: createdBy,
        },
      });

      return { user, role: roleRecord };
    });

    // Send email with credentials
    const emailResult = await sendUserCredentialsEmail({
      to: userData.email,
      name: userData.name,
      email: userData.email,
      password,
      role: userData.role,
    });

    if (!emailResult.success) {
      // Log the error but don't fail the user creation
      logError(new Error(emailResult.error), {
        action: 'createUser',
        step: 'emailSending',
        userId: result.user.id,
        email: userData.email,
        createdBy,
      });
      
      return {
        success: true,
        data: {
          user: {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            isActive: result.user.isActive,
            createdAt: result.user.createdAt,
          },
          role: {
            id: result.role.id,
            name: result.role.name,
          }
        },
        warning: USER_CREATION_ERRORS.SUCCESS_WITH_WARNING,
      };
    }

    // Log successful user creation
    logError(new Error('User created successfully'), {
      action: 'createUser',
      step: 'success',
      userId: result.user.id,
      email: userData.email,
      role: userData.role,
      createdBy,
    });

    return {
      success: true,
      data: {
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          isActive: result.user.isActive,
          createdAt: result.user.createdAt,
        },
        role: {
          id: result.role.id,
          name: result.role.name,
        }
      }
    };

  } catch (error) {
    // Log the error
    logError(error as Error, {
      action: 'createUser',
      step: 'database',
      userData: {
        name: userData.name,
        email: userData.email,
        role: userData.role,
      },
      createdBy,
    });
    
    return {
      success: false,
      error: USER_CREATION_ERRORS.USER_CREATION_FAILED,
    };
  }
}
