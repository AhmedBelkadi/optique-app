'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  User, 
  HelpCircle, 
  Settings, 
  FileText, 
  Search, 
  Eye, 
  MessageSquare,
  Globe,
  Clock,
  TrendingUp,
  Zap,
  Palette
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  current: boolean;
  badge?: string;
  children?: {
    name: string;
    href: string;
    icon: any;
    badge?: string;
  }[];
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: Home,
    current: false,
  },
  {
    name: 'Content Management',
    href: '/admin/content',
    icon: FileText,
    current: false,
    badge: 'Updated',
    children: [
      { name: 'Home Page', href: '/admin/content/home', icon: Home },
      { name: 'About Page', href: '/admin/content/about', icon: User },
      { name: 'FAQ Management', href: '/admin/content/faq-page', icon: HelpCircle, badge: 'Popular' },
      { name: 'Site Settings', href: '/admin/content/settings', icon: Settings },
      { name: 'SEO Settings', href: '/admin/content/seo', icon: Search },
    ],
  },
  {
    name: 'Business Management',
    href: '/admin',
    icon: Globe,
    current: false,
    children: [
      { name: 'Products', href: '/admin/products', icon: Globe },
      { name: 'Categories', href: '/admin/categories', icon: FileText },
      { name: 'Appointments', href: '/admin/appointments', icon: Clock },
      { name: 'Customers', href: '/admin/customers', icon: User },
      { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
    ],
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: TrendingUp,
    current: false,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    current: false,
    children: [
      { name: 'General Settings', href: '/admin/settings', icon: Settings },
      { name: 'Advanced Theme', href: '/admin/settings/advanced-theme', icon: Palette, badge: 'New' },
      { name: 'SEO Settings', href: '/admin/settings/seo', icon: Search },
      { name: 'Operations', href: '/admin/settings/operations', icon: Zap },
    ],
  },
];

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href || 
          (item.children && item.children.some(child => pathname === child.href));
        
        return (
          <div key={item.name}>
            {/* Main Navigation Item */}
            <Link href={item.href}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  isActive && 'bg-primary text-primary-foreground'
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Sub-navigation Items */}
            {item.children && isActive && (
              <div className="ml-6 mt-2 space-y-1">
                {item.children.map((child) => {
                  const isChildActive = pathname === child.href;
                  return (
                    <Link key={child.name} href={child.href}>
                      <Button
                        variant={isChildActive ? 'secondary' : 'ghost'}
                        size="sm"
                        className={cn(
                          'w-full justify-start text-sm',
                          isChildActive && 'bg-secondary text-secondary-foreground'
                        )}
                      >
                        <child.icon className="mr-2 h-4 w-4" />
                        {child.name}
                        {child.badge && (
                          <Badge 
                            variant={child.badge === 'New' ? 'default' : 'secondary'} 
                            className="ml-auto text-xs"
                          >
                            {child.badge}
                          </Badge>
                        )}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Quick Actions Section */}
      <div className="pt-6 border-t">
        <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Quick Actions
        </h3>
        <div className="space-y-1">
          <Link href="/admin/content/faq-page">
            <Button variant="default" size="sm" className="w-full justify-start text-sm">
              <HelpCircle className="mr-2 h-4 w-4 text-purple-600" />
              Manage FAQs & Page Settings
            </Button>
          </Link>
          <Link href="/admin/content/home">
            <Button variant="default" size="sm" className="w-full justify-start text-sm">
              <Eye className="mr-2 h-4 w-4 text-blue-600" />
              Update Hero Section
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
