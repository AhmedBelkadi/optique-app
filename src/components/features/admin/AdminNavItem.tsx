'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AdminNavItemProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  isCollapsed?: boolean;
  badge?: {
    count: number;
    variant?: 'secondary' | 'destructive';
  };
  description?: string;
  className?: string;
}

export default function AdminNavItem({
  href,
  label,
  icon: Icon,
  isActive = false,
  isCollapsed = false,
  badge,
  description,
  className = ""
}: AdminNavItemProps) {
  const getHoverStyles = () => {
    if (href.includes('trash')) {
      return 'text-foreground hover:bg-gradient-to-r hover:from-destructive/10 hover:to-destructive/10 hover:text-destructive hover:shadow-sm hover:shadow-destructive/20 active:from-destructive/20 active:to-destructive/15';
    }
    if (href.includes('settings')) {
      return 'text-foreground hover:bg-gradient-to-r hover:from-muted/60 hover:to-muted/40 hover:text-muted-foreground hover:shadow-sm active:from-muted/80 active:to-muted/60';
    }
    return 'text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary hover:shadow-sm hover:shadow-primary/20 active:from-primary/20 active:to-primary/15';
  };

  const getActiveStyles = () => {
    if (!isActive) return '';
    
    if (href.includes('trash')) {
      return 'bg-gradient-to-r from-destructive/20 via-destructive/15 to-destructive/10 text-destructive border-l-2 border-l-destructive shadow-sm shadow-destructive/30';
    }
    if (href.includes('settings')) {
      return 'bg-gradient-to-r from-muted/30 via-muted/20 to-muted/10 text-muted-foreground border-l-2 border-l-muted-foreground shadow-sm shadow-muted/30';
    }
    return 'bg-gradient-to-r from-primary/20 via-primary/15 to-primary/10 text-primary border-l-2 border-primary shadow-sm shadow-primary/30';
  };

  const navItem = (
    <Link
      href={href}
      className={`flex items-center rounded-xl transition-all duration-200 group relative min-h-[44px] ${
        isCollapsed ? 'justify-center w-12 h-11 mx-auto' : 'justify-start px-3 py-2.5 w-full'
      } ${getActiveStyles()} ${getHoverStyles()} ${className}`}
    >
      <Icon className={`transition-all duration-200 group-hover:scale-110 ${
        isCollapsed ? 'w-4 w-4' : 'w-4 w-4 mr-3'
      }`} />
      
      {!isCollapsed && (
        <>
          <div className="flex-1 min-w-0">
            <span className="font-semibold block text-sm">{label}</span>
            {description && (
              <span className="text-xs text-muted-foreground/70 block truncate mt-0.5 leading-tight">
                {description}
              </span>
            )}
          </div>
          {badge && (
            <Badge 
              variant={badge.variant} 
              className="ml-auto text-xs flex-shrink-0 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
            >
              {badge.count}
            </Badge>
          )}
        </>
      )}

      {/* Active indicator for collapsed state */}
      {isCollapsed && isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-sm shadow-primary/50" />
      )}

      {/* Touch feedback overlay for mobile */}
      <div className="absolute inset-0 rounded-xl bg-transparent transition-colors duration-150 group-active:bg-primary/5" />
    </Link>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {navItem}
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-primary border border-border max-w-xs shadow-lg">
            <div className="space-y-1.5">
              <p className="font-semibold text-primary-foreground">{label}</p>
              {description && (
                <p className="text-xs text-primary-foreground/80 leading-relaxed">{description}</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return navItem;
} 