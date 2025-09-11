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
  const getActiveStyles = () => {
    if (!isActive) {
      return 'text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-l-3 hover:border-l-primary hover:shadow-sm';
    }
    
    if (href.includes('trash')) {
      return 'bg-destructive/10 text-destructive border-l-3 border-l-destructive shadow-sm hover:bg-destructive/15';
    }
    if (href.includes('settings')) {
      return 'bg-muted/20 text-muted-foreground border-l-3 border-l-muted-foreground shadow-sm hover:bg-muted/30';
    }
    return 'bg-primary/10 text-primary border-l-3 border-primary shadow-sm hover:bg-primary/15';
  };

  const navItem = (
    <Link
      href={href}
      className={`flex items-center rounded-xl min-h-[44px] transition-colors duration-200 ${
        isCollapsed ? 'justify-center w-12 h-11 mx-auto' : 'justify-start px-3 py-2.5 w-full'
      } ${getActiveStyles()} ${className}`}
      aria-label={isCollapsed ? `${label}${description ? ` - ${description}` : ''}` : undefined}
      tabIndex={0}
    >
      <Icon className={`${
        isCollapsed ? 'w-4 h-4' : 'w-4 h-4 mr-3'
      } ${isActive ? 'text-primary' : ''}`} />
      
      {!isCollapsed && (
        <>
          <div className="flex-1 min-w-0">
            <span className={`font-semibold block text-sm ${isActive ? 'text-primary' : ''}`}>{label}</span>
            {description && (
              <span className="text-xs text-muted-foreground/70 block truncate mt-0.5 leading-tight">
                {description}
              </span>
            )}
          </div>
          {badge && (
            <Badge 
              variant={badge.variant} 
              className="ml-auto text-xs flex-shrink-0 bg-primary/10 text-primary border-primary/20"
            >
              {badge.count}
            </Badge>
          )}
        </>
      )}

      {/* Active indicator for collapsed state */}
      {isCollapsed && isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-sm" />
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {navItem}
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-primary border border-border max-w-xs">
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