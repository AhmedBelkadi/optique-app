'use client';

import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminLogo from './AdminLogo';
import AdminNavItem from './AdminNavItem';
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Trash2,
  Settings,
  MessageSquare,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: {
    count: number;
    variant?: 'secondary' | 'destructive';
  };
}

const navItems: NavItem[] = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/products',
    label: 'Products',
    icon: Package,
  },
  {
    href: '/admin/categories',
    label: 'Categories',
    icon: FolderOpen,
  },
  {
    href: '/admin/testimonials',
    label: 'Testimonials',
    icon: MessageSquare,
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: Settings,
  },
];

interface AdminMobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminMobileSidebar({ isOpen, onClose }: AdminMobileSidebarProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Mobile Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-80 lg:hidden mobile-sidebar">
        <div className="h-full bg-white/95 backdrop-blur-xl shadow-xl border-r border-slate-200/60 animate-in slide-in-from-left duration-300">
          {/* Header with close button */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200/60">
            <AdminLogo showSubtitle={false} />
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-slate-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Navigation */}
          <nav className="px-4 py-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <AdminNavItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={Icon}
                    isActive={isActive}
                    badge={item.badge}
                    onClick={onClose} // Close sidebar when item is clicked
                  />
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
} 