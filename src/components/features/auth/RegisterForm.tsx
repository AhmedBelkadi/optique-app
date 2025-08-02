'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { registerAction } from '@/features/auth/actions/register';

export default function RegisterForm() {
  const router = useRouter();
  const previousIsPending = useRef(false);
  
  const [state, formAction, isPending] = useActionState(registerAction, {
    error: '',
    fieldErrors: {},
    values: {
      name: '',
      email: '',
    },
  });

  // Handle registration success/error
  useEffect(() => {
    if (previousIsPending.current && !isPending && !state.error && state.success) {
      // Success - show toast and redirect
      toast.success('Registration successful! Welcome to Optique!');
      router.push('/login');
    } else if (previousIsPending.current && !isPending && state.error) {
      // Error occurred
      toast.error(state.error || 'Registration failed');
    }
    previousIsPending.current = isPending;
  }, [isPending, state.error, state.success, router]);

  return (
    <form className="mt-8 space-y-6" action={formAction}>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            defaultValue={state.values?.name || ''}
            className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Full Name"
          />
          {state.fieldErrors?.name && (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.name}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={state.values?.email || ''}
            className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Email address"
          />
          {state.fieldErrors?.email && (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.email}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Password"
          />
          {state.fieldErrors?.password && (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.password}</p>
          )}
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Confirm Password"
          />
          {state.fieldErrors?.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.confirmPassword}</p>
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
          {isPending ? 'Creating account...' : 'Create account'}
        </button>
      </div>

      <div className="text-center">
        <Link
          href="/login"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Already have an account? Sign in
        </Link>
      </div>
    </form>
  );
} 