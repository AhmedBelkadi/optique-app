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

export interface NavItem {
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

export interface NavGroup {
  title: string;
  items: NavItem[];
  defaultCollapsed?: boolean;
  adminOnly?: boolean; // Only admins can see this group
}

export const navGroups: NavGroup[] = [
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

// Helper function to filter navigation based on user role
export const filterNavigationByRole = (user: any) => {
  const isAdmin = user?.isAdmin || false;
  const isStaff = user?.isStaff || false;

  return navGroups.filter(group => {
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
  }).map(group => ({
    ...group,
    items: group.items.filter(item => {
      if (item.adminOnly && !isAdmin) return false;
      if (item.staffAccessible) return true;
      return isAdmin;
    })
  }));
};
