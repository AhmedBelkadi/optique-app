'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useState } from 'react';

interface AdminPageInfo {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  actions?: ReactNode;
  searchPlaceholder?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
}

interface AdminPageContextType {
  pageInfo: AdminPageInfo;
  setPageInfo: (info: AdminPageInfo) => void;
}

const AdminPageContext = createContext<AdminPageContextType | undefined>(undefined);

interface AdminPageProviderProps {
  children: ReactNode;
  initialPageInfo?: AdminPageInfo;
}

export function AdminPageProvider({ 
  children, 
  initialPageInfo = {
    title: 'Admin Dashboard',
    subtitle: 'Manage your optical business',
    showSearch: true,
    showNotifications: true,
  }
}: AdminPageProviderProps) {
  const [pageInfo, setPageInfo] = useState<AdminPageInfo>(initialPageInfo);

  return (
    <AdminPageContext.Provider value={{ pageInfo, setPageInfo }}>
      {children}
    </AdminPageContext.Provider>
  );
}

export function useAdminPage() {
  const context = useContext(AdminPageContext);
  if (context === undefined) {
    throw new Error('useAdminPage must be used within an AdminPageProvider');
  }
  return context;
} 