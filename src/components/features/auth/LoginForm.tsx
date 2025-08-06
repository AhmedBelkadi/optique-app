'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { loginAction } from '@/features/auth/actions/login';
import { useCSRF } from '@/components/common/CSRFProvider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const previousIsPending = useRef(false);
  const { csrfToken, isLoading, error } = useCSRF();
  const [showPassword, setShowPassword] = useState(false);
  
  const [state, formAction, isPending] = useActionState(loginAction, {
    success: false,
    error: '',
    fieldErrors: {},
    values: {
      email: '',
    },
  });

  // Handle login success/error
  useEffect(() => {
    if (previousIsPending.current && !isPending && !state.error && state.success) {
      // Success - show toast and redirect
      toast.success('Login successful!');
      router.push('/admin/');
    } else if (previousIsPending.current && !isPending && state.error) {
      // Error occurred
      toast.error(state.error || 'Login failed');
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
          <div className="text-center text-red-600">
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
          <div className="text-center text-red-600">
            <p>Security token not available.</p>
            <p className="text-sm">Please refresh the page.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Sign in to your account</CardTitle>
        <p className="text-sm text-muted-foreground text-center">
          Enter your credentials to access your account
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
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : ''
                  }`}
                  placeholder="Enter your email address"
                />
              </div>
              {state.fieldErrors?.email && (
                <p className="text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {state.fieldErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className={`pl-10 pr-10 ${
                    state.fieldErrors?.password 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : ''
                  }`}
                  placeholder="Enter your password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {state.fieldErrors?.password && (
                <p className="text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {state.fieldErrors.password}
                </p>
              )}
            </div>
          </div>

          {state.error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
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
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>

          <div className="text-center">
            <Link
              href="/auth/register"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 