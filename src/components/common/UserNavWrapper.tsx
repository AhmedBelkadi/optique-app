'use client';

import UserNav from './UserNav';

interface UserNavWrapperProps {
  user: any; // Replace with proper user type
}

export default function UserNavWrapper({ user }: UserNavWrapperProps) {
  if (!user) {
    return null;
  }

  return <UserNav />;
} 