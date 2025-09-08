'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { X, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminNavItem from './AdminNavItem';
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Settings,
  MessageSquare,
  Users,
  Calendar,
  Home,
  User,
  Image,
  Shield,
  UserCheck,
  Info,
  Wrench,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: {
    count: number;
    variant?: 'secondary' | 'destructive';
  };
  description?: string;
  adminOnly?: boolean;
  staffAccessible?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
  defaultCollapsed?: boolean;
  adminOnly?: boolean;
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
      {
        href: '/admin/content/seo',
        label: 'SEO',
        icon: Search,
        description: 'Gérer le SEO du site',
        staffAccessible: true
      },
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

interface AdminMobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
}

export default function AdminMobileSidebar({ isOpen, onClose, user }: AdminMobileSidebarProps) {
  const pathname = usePathname();
  
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

  // Simple role-based filtering
  const isAdmin = user?.isAdmin || false;
  const isStaff = user?.isStaff || false;

  const filteredNavGroups = navGroups.filter(group => {
    if (group.adminOnly && !isAdmin) return false;
    
    const filteredItems = group.items.filter(item => {
      if (item.adminOnly && !isAdmin) return false;
      if (item.staffAccessible) return true;
      return isAdmin;
    });

    return filteredItems.length > 0;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-background/95 backdrop-blur-xl border-r border-border/60 shadow-2xl mobile-sidebar">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/60">
          <h2 className="text-lg font-semibold text-foreground">Administration</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredNavGroups.map((group) => (
            <div key={group.title} className="space-y-2">
              <button
                onClick={() => toggleGroup(group.title)}
                className="flex items-center justify-between w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 px-2 rounded-md hover:bg-muted/50"
              >
                <span className="uppercase tracking-wider">{group.title}</span>
                {collapsedGroups.has(group.title) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </button>
              
              {!collapsedGroups.has(group.title) && (
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
                      />
                    ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
} 