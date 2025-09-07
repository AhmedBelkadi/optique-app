'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Settings,
  MessageSquare,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Home,
  User,
  Image,
  ChevronDown,
  ChevronUp,
  Shield,
  UserCheck,
  Info,
  Wrench,
} from 'lucide-react';
import AdminNavItem from './AdminNavItem';
import Link from 'next/link';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: {
    count: number;
    variant?: 'secondary' | 'destructive';
  };
  description?: string;
  adminOnly?: boolean; // Only admins can see this
  staffAccessible?: boolean; // Staff can access this
}

interface NavGroup {
  title: string;
  items: NavItem[];
  defaultCollapsed?: boolean;
  adminOnly?: boolean; // Only admins can see this group
}

const navGroups: NavGroup[] = [
  {
    title: 'Mon Compte',
    items: [
      {
        href: '/admin/profile',
        label: 'Mon Profil',
        icon: User,
        description: 'Gérer mon profil et mot de passe',
        staffAccessible: true
      }
    ],
    defaultCollapsed: false
  },
  {
    title: 'Activité Principale',
    items: [
      {
        href: '/admin',
        label: 'Tableau de Bord',
        icon: LayoutDashboard,
        description: 'Aperçu et analyses',
        staffAccessible: true
      },
      {
        href: '/admin/products',
        label: 'Produits',
        icon: Package,
        description: 'Gérer le catalogue de produits',
        staffAccessible: true
      },
      {
        href: '/admin/categories',
        label: 'Catégories',
        icon: FolderOpen,
        description: 'Organiser les produits',
        staffAccessible: true
      },
      {
        href: '/admin/customers',
        label: 'Clients',
        icon: Users,
        description: 'Base de données clients',
        staffAccessible: true
      },
      {
        href: '/admin/appointments',
        label: 'Rendez-vous',
        icon: Calendar,
        description: 'Gestion des rendez-vous',
        staffAccessible: true
      },
      {
        href: '/admin/testimonials',
        label: 'Témoignages',
        icon: MessageSquare,
        description: 'Avis clients',
        staffAccessible: true
      },
      {
        href: '/admin/banners',
        label: 'Bannières',
        icon: Image,
        description: 'Gérer les bannières du site',
        staffAccessible: true
      },
      {
        href: '/admin/services',
        label: 'Services',
        icon: Wrench,
        description: 'Gérer les services affichés',
        staffAccessible: true
      }
    ],
    defaultCollapsed: false
  },
  {
    title: 'Administration',
    items: [
      {
        href: '/admin/users',
        label: 'Utilisateurs',
        icon: UserCheck,
        description: 'Gérer les comptes utilisateurs',
        adminOnly: true
      },
      {
        href: '/admin/roles',
        label: 'Rôles & Permissions',
        icon: Shield,
        description: 'Gérer les rôles et permissions',
        adminOnly: true
      },
      {
        href: '/admin/settings',
        label: 'Paramètres',
        icon: Settings,
        description: 'Configuration du système',
        adminOnly: true
      }
    ],
    adminOnly: true,
    defaultCollapsed: true
  },
  {
    title: 'Contenu & CMS',
    items: [
      {
        href: '/admin/content/home',
        label: 'Accueil',
        icon: Home,
        description: 'Page d\'accueil',
        staffAccessible: true
      },
      {
        href: '/admin/content/about',
        label: 'A propos',
        icon: Info,
        description: 'A propos de nous',
        staffAccessible: true
      },
      {
        href: '/admin/content/faq',
        label: 'FAQ',
        icon: Info,
        description: 'Questions fréquentes',
        staffAccessible: true
      },
      // {
      //   href: '/admin/content/seo',
      //   label: 'SEO',
      //   icon: Search,
      //   description: 'Gérer le SEO du site',
      //   staffAccessible: true
      // }
      // ,
      {
        href: '/admin/content/operations',
        label: 'Opérations',
        icon: Settings,
        description: 'Gérer les opérations du site',
        staffAccessible: true
      }
    ],
    defaultCollapsed: true
  }
];

interface AdminSidebarProps {
  user?: any;
  className?: string;
  onSidebarCollapse?: (collapsed: boolean) => void;
}

export default function AdminSidebar({ user, className = "", onSidebarCollapse }: AdminSidebarProps) {
  // Sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Initialize collapsed state based on defaultCollapsed property
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    navGroups.forEach(group => {
      if (group.defaultCollapsed) {
        initial.add(group.title);
      }
    });
    return initial;
  });
  
  const pathname = usePathname();

  // Notify parent of initial state
  useEffect(() => {
    onSidebarCollapse?.(isSidebarCollapsed);
  }, [isSidebarCollapsed, onSidebarCollapse]); // Run when state changes

  const toggleGroup = (groupTitle: string) => {
    setCollapsedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupTitle)) {
        newSet.delete(groupTitle);
      } else {
        newSet.add(groupTitle);
      }
      return newSet;
    });
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const newState = !prev;
      onSidebarCollapse?.(newState);
      return newState;
    });
  };

  // Simple role-based filtering
  const isAdmin = user?.isAdmin || false;
  const isStaff = user?.isStaff || false;

  const filteredNavGroups = navGroups.filter(group => {
    // If group is admin-only, only show to admins
    if (group.adminOnly && !isAdmin) return false;
    
    // Filter items within each group
    const filteredItems = group.items.filter(item => {
      // If item is admin-only, only show to admins
      if (item.adminOnly && !isAdmin) return false;
      
      // If item is staff-accessible, show to both admin and staff
      if (item.staffAccessible) return true;
      
      // Default: only show to admins
      return isAdmin;
    });

    // Only show groups that have visible items
    return filteredItems.length > 0;
  });

  return (
    <aside className={`fixed left-0 top-0 h-screen z-50 bg-background/80 backdrop-blur-xl border-r border-border/60 flex flex-col transition-all duration-300 ${
      isSidebarCollapsed ? 'w-16' : 'w-64'
    } ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border/60">
        <div className="flex items-center justify-between">
          {!isSidebarCollapsed && (
            <h2 className="text-lg font-semibold text-foreground">Administration</h2>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md hover:bg-muted/50 transition-colors"
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronLeft className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            {!isSidebarCollapsed && (
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                <Home className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredNavGroups.map((group) => (
          <div key={group.title} className="space-y-2">
            {!isSidebarCollapsed && (
              <button
                onClick={() => toggleGroup(group.title)}
                className="flex items-center justify-between w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 px-2 rounded-md hover:bg-muted/50"
              >
                <span>{group.title}</span>
                {collapsedGroups.has(group.title) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </button>
            )}
            
            {(!isSidebarCollapsed && !collapsedGroups.has(group.title)) && (
              <div className="space-y-1 ml-2">
                {group.items
                  .filter(item => {
                    if (item.adminOnly && !isAdmin) return false;
                    if (item.staffAccessible) return true;
                    return isAdmin;
                  })
                  .map((item) => (
                    <AdminNavItem
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      icon={item.icon}
                      description={item.description}
                      badge={item.badge}
                      isActive={pathname === item.href}
                      isCollapsed={isSidebarCollapsed}
                    />
                  ))}
              </div>
            )}

            {/* Show only icons when sidebar is collapsed */}
            {isSidebarCollapsed && (
              <div className="space-y-1">
                {group.items
                  .filter(item => {
                    if (item.adminOnly && !isAdmin) return false;
                    if (item.staffAccessible) return true;
                    return isAdmin;
                  })
                  .map((item) => (
                    <AdminNavItem
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      icon={item.icon}
                      description={item.description}
                      badge={item.badge}
                      isActive={pathname === item.href}
                      isCollapsed={true}
                    />
                  ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
