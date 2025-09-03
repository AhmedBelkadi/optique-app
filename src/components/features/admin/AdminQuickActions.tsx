'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Calendar, 
  Users, 
  Image, 
  FolderOpen, 
  FileText, 
  Settings, 
  Palette, 
  Shield, 
  UserCheck,
  Eye,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { User } from '@/types/global';

interface QuickAction {
  title: string;
  description: string;
  icon: any;
  href: string;
  category: string;
  adminOnly: boolean;
  staffAccessible: boolean;
  color: string;
}

interface AdminQuickActionsProps {
  user: User | null;
}

export default function AdminQuickActions({ user }: AdminQuickActionsProps) {
  const isAdmin = user?.userRoles?.some((userRole: any) => userRole.role.name === 'admin') || false;
  const isStaff = user?.userRoles?.some((userRole: any) => userRole.role.name === 'staff') || false;

  const quickActions: QuickAction[] = [
    // Content & CMS
    {
      title: 'Produits',
      description: 'Gérer le catalogue de produits',
      icon: Package,
      href: '/admin/products',
      category: 'Contenu & CMS',
      adminOnly: false,
      staffAccessible: true,
      color: 'bg-blue-500',
    },
    {
      title: 'Catégories',
      description: 'Organiser les catégories de produits',
      icon: FolderOpen,
      href: '/admin/categories',
      category: 'Contenu & CMS',
      adminOnly: false,
      staffAccessible: true,
      color: 'bg-green-500',
    },
    {
      title: 'Rendez-vous',
      description: 'Gérer les rendez-vous clients',
      icon: Calendar,
      href: '/admin/appointments',
      category: 'Contenu & CMS',
      adminOnly: false,
      staffAccessible: true,
      color: 'bg-purple-500',
    },
    {
      title: 'Clients',
      description: 'Base de données des clients',
      icon: Users,
      href: '/admin/customers',
      category: 'Contenu & CMS',
      adminOnly: false,
      staffAccessible: true,
      color: 'bg-orange-500',
    },
    {
      title: 'Bannières',
      description: 'Gérer les bannières du site',
      icon: Image,
      href: '/admin/content/banners',
      category: 'Contenu & CMS',
      adminOnly: false,
      staffAccessible: true,
      color: 'bg-pink-500',
    },
    {
      title: 'FAQ',
      description: 'Gérer la page FAQ',
      icon: FileText,
      href: '/admin/content/faq',
      category: 'Contenu & CMS',
      adminOnly: false,
      staffAccessible: true,
      color: 'bg-indigo-500',
    },
    // Settings
    {
      title: 'Paramètres du Site',
      description: 'Configuration générale du site',
      icon: Settings,
      href: '/admin/settings',
      category: 'Paramètres',
      adminOnly: true,
      staffAccessible: false,
      color: 'bg-gray-500',
    },
    {
      title: 'Paramètres du Thème',
      description: 'Personnaliser l\'apparence',
      icon: Palette,
      href: '/admin/settings/theme',
      category: 'Paramètres',
      adminOnly: true,
      staffAccessible: false,
      color: 'bg-teal-500',
    },
    // Administration
    {
      title: 'Utilisateurs',
      description: 'Gérer les comptes utilisateurs',
      icon: UserCheck,
      href: '/admin/users',
      category: 'Administration',
      adminOnly: true,
      staffAccessible: false,
      color: 'bg-red-500',
    },
    {
      title: 'Rôles & Permissions',
      description: 'Contrôle d\'accès et sécurité',
      icon: Shield,
      href: '/admin/roles',
      category: 'Administration',
      adminOnly: true,
      staffAccessible: false,
      color: 'bg-yellow-500',
    },
  ];

  // Filter actions based on user role
  const filteredActions = quickActions.filter(action => {
    if (isAdmin) return true;
    if (isStaff && action.staffAccessible) return true;
    return false;
  });

  // Group actions by category
  const groupedActions = filteredActions.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = [];
    }
    acc[action.category].push(action);
    return acc;
  }, {} as Record<string, QuickAction[]>);

  const categories = Object.keys(groupedActions);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Actions Rapides</h2>
          <p className="text-muted-foreground">
            Accès rapide aux fonctionnalités principales
            {user && (
              <span className="ml-2 text-sm">
                (Rôle: {user.userRoles?.[0]?.role?.name || 'Utilisateur'})
              </span>
            )}
          </p>
        </div>
        
        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge 
              key={category} 
              variant="secondary" 
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Actions Grid */}
      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">
              {category}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedActions[category].map((action) => {
                const IconComponent = action.icon;
                return (
                  <Card 
                    key={action.title} 
                    className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className={`p-2 rounded-lg ${action.color} text-white`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            action.adminOnly ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {action.adminOnly ? 'Admin' : 'Staff'}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {action.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {action.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <Button asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Link href={action.href}>
                          <Eye className="h-4 w-4 mr-2" />
                          Accéder
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredActions.length === 0 && (
        <Card className="text-center py-12">
          <div className="space-y-4">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">Aucune action disponible</h3>
              <p className="text-muted-foreground">
                Votre rôle ne vous donne pas accès aux actions rapides.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
