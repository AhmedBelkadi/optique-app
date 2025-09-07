import { prisma } from '@/lib/prisma';
import { generateSecureToken } from '@/lib/shared/utils/crypto';
import { sendPasswordResetEmail } from '@/lib/shared/services/emailService';

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResult {
  success: boolean;
  error?: string;
  message?: string;
}

export interface PasswordResetToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

export async function requestPasswordReset(email: string): Promise<PasswordResetResult> {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return {
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      };
    }

    // Generate secure token
    const token = generateSecureToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Invalidate any existing reset tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id },
      data: { used: true },
    });

    // Create new reset token
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // Send reset email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;
    
    const emailResult = await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl: resetUrl,
    });

    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error);
      // Don't fail the request, just log the error
    }

    return {
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    };
  } catch (error) {
    console.error('Error requesting password reset:', error);
    return {
      success: false,
      error: 'An error occurred while processing your request. Please try again.',
    };
  }
}

export async function validateResetToken(token: string): Promise<{ valid: boolean; userId?: string; error?: string }> {
  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      return { valid: false, error: 'Invalid or expired reset token.' };
    }

    if (resetToken.used) {
      return { valid: false, error: 'This reset token has already been used.' };
    }

    if (resetToken.expiresAt < new Date()) {
      return { valid: false, error: 'This reset token has expired.' };
    }

    if (!resetToken.user.isActive) {
      return { valid: false, error: 'This account is no longer active.' };
    }

    return { valid: true, userId: resetToken.userId };
  } catch (error) {
    console.error('Error validating reset token:', error);
    return { valid: false, error: 'An error occurred while validating the reset token.' };
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<PasswordResetResult> {
  try {
    // Validate token
    const tokenValidation = await validateResetToken(token);
    if (!tokenValidation.valid) {
      return {
        success: false,
        error: tokenValidation.error || 'Invalid reset token.',
      };
    }

    // Hash new password
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password and mark token as used
    await prisma.$transaction(async (tx) => {
      // Update user password
      await tx.user.update({
        where: { id: tokenValidation.userId! },
        data: { password: hashedPassword },
      });

      // Mark token as used
      await tx.passwordResetToken.update({
        where: { token },
        data: { used: true },
      });

      // Invalidate all user sessions
      await tx.session.deleteMany({
        where: { userId: tokenValidation.userId! },
      });
    });

    return {
      success: true,
      message: 'Your password has been successfully reset. Please log in with your new password.',
    };
  } catch (error) {
    console.error('Error resetting password:', error);
    return {
      success: false,
      error: 'An error occurred while resetting your password. Please try again.',
    };
  }
}

export async function cleanupExpiredTokens(): Promise<void> {
  try {
    await prisma.passwordResetToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { used: true },
        ],
      },
    });
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
  }
}
