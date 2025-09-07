'use client';

import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import { logoutAction } from '@/features/auth/actions/logout';

interface UserNavProps {
  csrfToken?: string | null;
}

export default function UserNav({ csrfToken }: UserNavProps) {
  const handleLogout = async (formData: FormData) => {
    await logoutAction({}, formData);
  };

  return (
    <div className="flex items-center space-x-4">
      <form action={handleLogout}>
        <input type="hidden" name="csrf_token" value={csrfToken || ''} />
        <Button
          type="submit"
          className="bg-red-500 hover:bg-red-600"
          size="sm"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </form>
    </div>
  );
}
