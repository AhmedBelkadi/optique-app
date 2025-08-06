'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface AdminNavItemProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  badge?: {
    count: number;
    variant?: 'secondary' | 'destructive';
  };
  className?: string;
  onClick?: () => void;
}

export default function AdminNavItem({
  href,
  label,
  icon: Icon,
  isActive = false,
  badge,
  className = "",
  onClick
}: AdminNavItemProps) {
  const getHoverStyles = () => {
    if (href.includes('trash')) {
      return 'text-slate-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600';
    }
    if (href.includes('settings')) {
      return 'text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 hover:text-slate-600';
    }
    return 'text-slate-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600';
  };

  const getActiveStyles = () => {
    return isActive ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600' : '';
  };

  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${getActiveStyles()} ${getHoverStyles()} ${className}`}
      onClick={onClick}
    >
      <Icon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
      <span className="font-medium">{label}</span>
      {badge && (
        <Badge 
          variant={badge.variant} 
          className="ml-auto text-xs"
        >
          {badge.count}
        </Badge>
      )}
    </Link>
  );
} 