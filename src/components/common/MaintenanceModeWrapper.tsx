'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import MaintenanceMode from './MaintenanceMode';

interface MaintenanceModeWrapperProps {
  children: React.ReactNode;
  siteName?: string;
  maintenanceMode: boolean;
}

export default function MaintenanceModeWrapper({
  children,
  siteName,
  maintenanceMode
}: MaintenanceModeWrapperProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading delay if needed
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const isAdminPage = pathname.startsWith('/admin');
  const isAuthPage = pathname.startsWith('/auth');
  const isApiRoute = pathname.startsWith('/api');

  if (isAdminPage || isAuthPage || isApiRoute) {
    return <>{children}</>;
  }

  if (isLoading) {
    return <>{children}</>;
  }

  if (maintenanceMode) {
    return <MaintenanceMode siteName={siteName} />;
  }

  return <>{children}</>;
}

