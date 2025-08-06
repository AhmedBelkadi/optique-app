'use client';

import { useEffect, useRef, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import { logoutAction } from '@/features/auth/actions/logout';
import { Button } from '../ui/button';
import { LogOut, Loader2 } from 'lucide-react';
import { useCSRF } from '@/components/common/CSRFProvider';

export default function UserNav() {
  const router = useRouter();
  const previousIsPending = useRef(false);
  const { csrfToken, isLoading, error } = useCSRF();

  const [state, formAction, isPending] = useActionState(logoutAction, {
    success: false,
    error: '',
  });

  useEffect(() => {
    if (previousIsPending.current && !isPending) {
      if (state.success) {
        toast.success('Logged out successfully!');
        router.push('/auth/login');
      } else if (state.error) {
        toast.error(state.error || 'Failed to logout');
      }
    }
    previousIsPending.current = isPending;
  }, [isPending, state.success, state.error, router]);

  const handleLogout = () => {
    if (isLoading) {
      toast.error('Security token is still loading. Please wait.');
      return;
    }

    if (error) {
      toast.error('Security token error. Please refresh the page.');
      return;
    }

    const formData = new FormData();
    
    // Add CSRF token to form data
    if (csrfToken) {
      formData.append('csrf_token', csrfToken);
    } else {
      toast.error('Security token not available. Please refresh the page.');
      return;
    }
    
    // Wrap the formAction call in startTransition
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="flex items-center space-x-4">
      <Button
        onClick={handleLogout}
        disabled={isPending || isLoading}
        variant="destructive"
        size="sm"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <LogOut className="w-4 h-4" />
        )}
        {isPending ? 'Logging out...' : isLoading ? 'Loading...' : 'Logout'}
      </Button>
    </div>
  );
}
