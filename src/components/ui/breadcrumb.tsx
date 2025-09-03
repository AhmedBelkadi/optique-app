import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <section className={`border-b bg-gradient-to-br from-primary/5 to-primary/10 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-2 py-4 text-sm text-muted-foreground">
          <Link 
            href="/" 
            className="hover:text-foreground transition-colors duration-200 hover:underline flex items-center gap-1"
          >
            <Home className="h-4 w-4" />
            Accueil
          </Link>
          
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <ChevronRight className="h-4 w-4 text-primary" />
              {item.href ? (
                <Link 
                  href={item.href} 
                  className="hover:text-primary  transition-colors duration-200 hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-primary font-medium truncate max-w-xs">
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>
    </section>
  );
}
