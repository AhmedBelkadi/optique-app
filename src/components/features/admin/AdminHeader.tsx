'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, Search, Bell, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UserNav from '@/components/common/UserNav';
import { useAdminPage } from './AdminPageContext';

interface AdminHeaderProps {
  user?: any;
  onMenuToggle?: () => void;
  className?: string;
}

export default function AdminHeader({ 
  user,
  onMenuToggle,
  className = ""
}: AdminHeaderProps) {
  const { pageInfo } = useAdminPage();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className={`bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/60 sticky top-0 z-20 ${className}`}>
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="lg:hidden hover:bg-slate-100 rounded-lg menu-toggle"
            onClick={onMenuToggle}
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 min-w-0">
            {/* Breadcrumbs */}
            {pageInfo.breadcrumbs && pageInfo.breadcrumbs.length > 0 && (
              <nav className="flex items-center space-x-1 text-sm text-slate-500 mb-1 hidden sm:flex">
                <Link href="/admin" className="flex items-center hover:text-slate-700">
                  <Home className="w-3 h-3 mr-1" />
                  Admin
                </Link>
                {pageInfo.breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center">
                    <ChevronRight className="w-3 h-3 mx-1" />
                    {crumb.href ? (
                      <Link 
                        href={crumb.href}
                        className="hover:text-slate-700 transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-slate-600 font-medium">{crumb.label}</span>
                    )}
                  </div>
                ))}
              </nav>
            )}
            
            {/* Page Title and Subtitle */}
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-slate-900 truncate">{pageInfo.title}</h1>
              {pageInfo.subtitle && (
                <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">{pageInfo.subtitle}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Page Actions */}
          {pageInfo.actions && (
            <div className="hidden sm:flex items-center space-x-2">
              {pageInfo.actions}
            </div>
          )}

          {/* Search */}
          {pageInfo.showSearch && (
            <div className="hidden md:flex items-center space-x-2 bg-slate-100/80 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder={pageInfo.searchPlaceholder || "Search..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-slate-600 placeholder-slate-400 w-48 focus:ring-0 focus:outline-none"
              />
            </div>
          )}

          {/* User */}
          {user ? (
            <UserNav />
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 