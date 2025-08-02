'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import { logoutAction } from '@/features/auth/actions/logout';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserNavProps {
  user: User;
}

export default function UserNav({ user }: UserNavProps) {
  const router = useRouter();
  
  const [state, formAction, isPending] = useActionState(logoutAction, {
    success: false,
    error: '',
  });

  // Handle success/error states
  React.useEffect(() => {
    if (state.success) {
      toast.success('Logged out successfully!');
      router.push('/login');
    } else if (state.error) {
      toast.error(state.error || 'Failed to logout');
    }
  }, [state.success, state.error, router]);

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-700">
        Welcome, {user.name}
      </span>
      <form action={formAction}>
        <button
          type="submit"
          disabled={isPending}
          className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {isPending ? 'Logging out...' : 'Logout'}
        </button>
      </form>
    </div>
  );
} 