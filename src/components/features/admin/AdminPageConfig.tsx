'use client';

import { useEffect } from 'react';
import { useAdminPage } from './AdminPageContext';

interface AdminPageConfigProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  searchPlaceholder?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
}

export default function AdminPageConfig({
  title,
  subtitle,
  breadcrumbs,
  searchPlaceholder,
  showSearch = false,
  showNotifications = false,
}: AdminPageConfigProps) {
  const { setPageInfo } = useAdminPage();

  useEffect(() => {
    setPageInfo({
      title,
      subtitle,
      breadcrumbs,
      searchPlaceholder,
      showSearch,
      showNotifications,
    });
  }, [title, subtitle, breadcrumbs, searchPlaceholder, showSearch, showNotifications, setPageInfo]);

  return null; // This component doesn't render anything
} 