'use client';

import { useEffect } from 'react';
import { useAdminPage } from './AdminPageContext';

interface AdminPageConfig {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  actions?: React.ReactNode;
  searchPlaceholder?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
}

export function useAdminPageConfig(config: AdminPageConfig) {
  const { setPageInfo } = useAdminPage();

  useEffect(() => {
    setPageInfo({
      title: config.title,
      subtitle: config.subtitle,
      breadcrumbs: config.breadcrumbs,
      actions: config.actions,
      searchPlaceholder: config.searchPlaceholder,
      showSearch: config.showSearch ?? true,
      showNotifications: config.showNotifications ?? true,
    });
  }, [config, setPageInfo]);
} 