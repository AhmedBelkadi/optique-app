'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { forgotPasswordAction } from '@/features/auth/actions/forgotPassword';
import { useCSRF } from '@/components/common/CSRFProvider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, ArrowLeft, CheckCircle, Shield, Clock, AlertTriangle } from 'lucide-react';

export default function ForgotPasswordForm() {
  const router = useRouter();
  const previousIsPending = useRef(false);
  const { csrfToken, isLoading, error } = useCSRF();
  
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, {
    success: false,
    error: '',
    fieldErrors: {},
    values: {
      email: '',
    },
  });

  // Handle form success/error
  useEffect(() => {
    if (previousIsPending.current && !isPending && !state.error && state.success) {
      // Success - show success message
      toast.success('Password reset email sent! Check your inbox.');
    } else if (previousIsPending.current && !isPending && state.error) {
      // Error occurred
      toast.error(state.error || 'Failed to send reset email');
    }
    previousIsPending.current = isPending;
  }, [isPending, state.error, state.success]);

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

  if (state.success) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">Email Sent!</CardTitle>
          <p className="text-sm text-muted-foreground">
            If an account with that email exists, a password reset link has been sent.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Check your email and click the reset link to continue.
            </p>
            
            {/* Security Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-blue-900">What happens next?</h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Check your email inbox (and spam folder)</li>
                    <li>• Click the reset link in the email</li>
                    <li>• Create a new secure password</li>
                    <li>• Log in with your new password</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Expiry Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-amber-900">Important</h4>
                  <p className="text-xs text-amber-700 mt-1">
                    The reset link expires in 1 hour for security reasons.
                  </p>
                </div>
              </div>
            </div>

            <Link href="/auth/login">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
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
        <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
        <p className="text-sm text-muted-foreground text-center">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" action={formAction}>
          {/* CSRF Token */}
          <input type="hidden" name="csrf_token" value={csrfToken} />
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  defaultValue={state.values?.email || ''}
                  className={`pl-10 ${
                    state.fieldErrors?.email 
                      ? 'border-red-500 focus:border-destructive focus:ring-destructive' 
                      : ''
                  }`}
                  placeholder="Enter your email address"
                />
              </div>
              {state.fieldErrors?.email && (
                <p className="text-sm text-destructive flex items-center">
                  <span className="mr-1">⚠️</span>
                  {state.fieldErrors.email}
                </p>
              )}
            </div>

            {/* Help Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-blue-900">How it works</h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Enter the email address associated with your account</li>
                    <li>• We'll send you a secure reset link</li>
                    <li>• The link expires in 1 hour for security</li>
                    <li>• You can only use the link once</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-amber-900">Security Notice</h4>
                  <p className="text-xs text-amber-700 mt-1">
                    For security reasons, we don't reveal whether an email address exists in our system.
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
                Sending Reset Link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>

          <div className="text-center">
            <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="inline h-4 w-4 mr-1" />
              Back to Login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
