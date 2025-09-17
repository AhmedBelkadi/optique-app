'use client';

import Link from 'next/link';

interface AdminLogoProps {
  href?: string;
  className?: string;
  showSubtitle?: boolean;
}

export default function AdminLogo({ 
  href = "/admin", 
  className = "",
  showSubtitle = true 
}: AdminLogoProps) {
  return (
    <Link href={href} className={`flex items-center space-x-2 sm:space-x-3 ${className}`}>
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
        <span className="text-primary-foreground font-bold text-sm sm:text-lg">O</span>
      </div>
      <div>
        <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Optique Admin
        </h1>
        {showSubtitle && (
          <p className="text-xs text-muted-foreground">Management Console</p>
        )}
      </div>
    </Link>
  );
} 