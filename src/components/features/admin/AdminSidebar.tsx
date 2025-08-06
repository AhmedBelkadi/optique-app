'use client';

import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Trash2,
  Settings,
  MessageSquare,
  Users,
  Calendar,
} from 'lucide-react';
import AdminLogo from './AdminLogo';
import AdminNavItem from './AdminNavItem';

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
    href: '/admin/customers',
    label: 'Customers',
    icon: Users,
  },
  {
    href: '/admin/appointments',
    label: 'Appointments',
    icon: Calendar,
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

interface AdminSidebarProps {
  className?: string;
}

export default function AdminSidebar({ className = "" }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-72 bg-white/80 backdrop-blur-xl shadow-xl border-r border-slate-200/60 z-30 ${className}`}
    >
      {/* Logo Section */}
      <div className="p-6 lg:p-8">
        <AdminLogo />
      </div>

      {/* Navigation */}
      <nav className="px-4 lg:px-6">
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
              />
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
