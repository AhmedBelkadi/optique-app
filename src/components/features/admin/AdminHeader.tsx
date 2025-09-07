'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, Search, Bell, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UserNav from '@/components/common/UserNav';
import { useAdminPage } from './AdminPageContext';
import { useCSRF } from '@/components/common/CSRFProvider';


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
  const { csrfToken } = useCSRF();

  return (
    <header className={`bg-background/80 backdrop-blur-xl shadow-sm border-b border-border/60 sticky top-0 z-20 ${className}`}>
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="lg:hidden hover:bg-muted rounded-lg menu-toggle"
            onClick={onMenuToggle}
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 min-w-0">
            {/* Breadcrumbs */}
            {pageInfo.breadcrumbs && pageInfo.breadcrumbs.length > 0 && (
              <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-1 hidden sm:flex">
                <Link href="/admin" className="flex items-center hover:text-foreground">
                  <Home className="w-3 h-3 mr-1" />
                  Admin
                </Link>
                {pageInfo.breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center">
                    <ChevronRight className="w-3 h-3 mx-1" />
                    {crumb.href ? (
                      <Link 
                        href={crumb.href}
                        className="hover:text-foreground transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground font-medium">{crumb.label}</span>
                    )}
                  </div>
                ))}
              </nav>
            )}
            
            {/* Page Title and Subtitle */}
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">{pageInfo.title}</h1>
              {pageInfo.subtitle && (
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">{pageInfo.subtitle}</p>
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
            <div className="hidden md:flex items-center space-x-2 bg-muted/80 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-muted-foreground/60" />
              <Input
                type="text"
                placeholder={pageInfo.searchPlaceholder || "Search..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-muted-foreground placeholder-slate-400 w-48 focus:ring-0 focus:outline-none"
              />
            </div>
          )}

          {/* User */}
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex flex-col items-end text-right">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <UserNav csrfToken={csrfToken} />
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/auth/login">
                <Button variant="default" size="sm" className="hidden sm:inline-flex">
                  Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 