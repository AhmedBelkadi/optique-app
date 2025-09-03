'use client';

import { Button } from '../ui/button';
import { LogOut, Loader2 } from 'lucide-react';

interface UserNavProps {
  onLogout?: () => void;
}

export default function UserNav({ onLogout }: UserNavProps) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600"
        size="sm"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </div>
  );
}
