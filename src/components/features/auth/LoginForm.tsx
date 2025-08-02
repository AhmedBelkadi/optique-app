'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { loginAction } from '@/features/auth/actions/login';

export default function LoginForm() {
  const router = useRouter();
  const previousIsPending = useRef(false);
  
  const [state, formAction, isPending] = useActionState(loginAction, {
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
      router.push('/products');
    } else if (previousIsPending.current && !isPending && state.error) {
      // Error occurred
      toast.error(state.error || 'Login failed');
    }
    previousIsPending.current = isPending;
  }, [isPending, state.error, state.success, router]);

  return (
    <form className="mt-8 space-y-6" action={formAction}>
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={state.values?.email || ''}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
          />
          {state.fieldErrors?.email && (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.email}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Password"
          />
          {state.fieldErrors?.password && (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.password}</p>
          )}
        </div>
      </div>

      {state.error && (
        <div className="text-red-600 text-sm text-center">{state.error}</div>
      )}

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isPending ? 'Signing in...' : 'Sign in'}
        </button>
      </div>

      <div className="text-center">
        <Link
          href="/register"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Don't have an account? Sign up
        </Link>
      </div>
    </form>
  );
} 