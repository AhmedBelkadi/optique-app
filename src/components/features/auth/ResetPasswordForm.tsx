'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { resetPasswordAction } from '@/features/auth/actions/resetPassword';
import { useCSRF } from '@/components/common/CSRFProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle, Shield, Clock } from 'lucide-react';
import PasswordInput from './PasswordInput';
import PasswordConfirmationInput from './PasswordConfirmationInput';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const previousIsPending = useRef(false);
  const { csrfToken, isLoading, error } = useCSRF();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const token = searchParams.get('token');
  
  const [state, formAction, isPending] = useActionState(resetPasswordAction, {
    success: false,
    error: '',
    fieldErrors: {},
    values: {
      password: '',
      confirmPassword: '',
    },
  });

  // Handle form success/error
  useEffect(() => {
    if (previousIsPending.current && !isPending && !state.error && state.success) {
      // Success - show success message and redirect
      toast.success('Password reset successfully! Please log in with your new password.');
      router.push('/auth/login');
    } else if (previousIsPending.current && !isPending && state.error) {
      // Error occurred
      toast.error(state.error || 'Failed to reset password');
    }
    previousIsPending.current = isPending;
  }, [isPending, state.error, state.success, router]);

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading security token...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            <p>Error loading security token.</p>
            <p className="text-sm">Please refresh the page.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!csrfToken) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            <p>Security token not available.</p>
            <p className="text-sm">Please refresh the page.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!token) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold mb-2">Invalid Reset Link</h2>
            <p className="text-sm text-muted-foreground mb-4">
              This password reset link is invalid or has expired.
            </p>
            <Link href="/auth/forgot-password">
              <Button variant="outline" className="w-full">
                Request New Reset Link
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
        <p className="text-sm text-muted-foreground text-center">
          Enter your new password below
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" action={formAction}>
          {/* CSRF Token */}
          <input type="hidden" name="csrf_token" value={csrfToken} />
          <input type="hidden" name="token" value={token} />
          
          <div className="space-y-6">
            <PasswordInput
              id="password"
              name="password"
              label="New Password"
              placeholder="Enter your new password"
              autoComplete="new-password"
              required
              showStrengthIndicator={true}
              showPreview={true}
              error={state.fieldErrors?.password?.[0]}
              value={password}
              onChange={setPassword}
            />

            <PasswordConfirmationInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm New Password"
              placeholder="Confirm your new password"
              autoComplete="new-password"
              required
              password={password}
              error={state.fieldErrors?.confirmPassword?.[0]}
              value={confirmPassword}
              onChange={setConfirmPassword}
            />

            {/* Security Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-blue-900">Security Information</h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Your password is encrypted and stored securely</li>
                    <li>• This reset link can only be used once</li>
                    <li>• All your existing sessions will be logged out</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Token Expiry Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-amber-900">Important</h4>
                  <p className="text-xs text-amber-700 mt-1">
                    This password reset link expires in 1 hour. Please complete the reset process soon.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {state.error && (
            <div className="p-3 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-md">
              <div className="flex items-center">
                <span className="mr-2">❌</span>
                {state.error}
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full"
            size="lg"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>

          <div className="text-center">
            <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-primary">
              Back to Login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
