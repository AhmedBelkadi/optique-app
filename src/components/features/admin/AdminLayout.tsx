'use client';

import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import AdminSidebar from './AdminSidebar';
import AdminMobileSidebar from './AdminMobileSidebar';
import AdminHeader from './AdminHeader';
import { AdminPageProvider } from './AdminPageContext';

const inter = Inter({ subsets: ['latin'] });

interface AdminLayoutProps {
  children: React.ReactNode;
  user?: any;
  className?: string;
}

export default function AdminLayout({
  children,
  user,
  className = ""
}: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSidebarOpen]);

  // Close sidebar when clicking outside (for mobile)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isSidebarOpen && !target.closest('.mobile-sidebar') && !target.closest('.menu-toggle')) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  return (
    <AdminPageProvider>
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex ${inter.className} ${className}`}>
        {/* Desktop Sidebar - Hidden on mobile */}
        <AdminSidebar className="hidden lg:block" />
        
        {/* Mobile Sidebar */}
        <AdminMobileSidebar 
          isOpen={isSidebarOpen} 
          onClose={handleSidebarClose} 
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col w-full lg:ml-72">
          {/* Header */}
          <AdminHeader
            user={user}
            onMenuToggle={handleMenuToggle}
          />

          {/* Page content */}
          <main className="flex-1 px-4 sm:px-6 py-4 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminPageProvider>
  );
} 