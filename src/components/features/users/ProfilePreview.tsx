'use client';

import { UserWithRoles } from '@/features/auth/services/session';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Activity,
  Lock
} from 'lucide-react';

interface ProfilePreviewProps {
  user: UserWithRoles;
  showDetails?: boolean;
}

export function ProfilePreview({ user, showDetails = false }: ProfilePreviewProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return 'Jamais';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAccountStatus = () => {
    // Assume user is active if they have roles and are either admin or staff
    const isActive = user.roles.length > 0 && (user.isAdmin || user.isStaff);
    
    if (!isActive) {
      return { status: 'inactive', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
    }
    return { status: 'active', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
  };

  const accountStatus = getAccountStatus();
  const StatusIcon = accountStatus.icon;

  return (
    <div className="space-y-6">
      {/* Enhanced Profile Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30 overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 p-6">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="h-12 w-12 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800 mb-2">{user.name}</CardTitle>
            <p className="text-slate-600 mb-3">{user.email}</p>
            
            {/* Account Status Badge */}
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${accountStatus.bg} ${accountStatus.border} border`}>
              <StatusIcon className={`h-4 w-4 ${accountStatus.color}`} />
              <span className={`text-sm font-semibold ${accountStatus.color}`}>
                Compte {accountStatus.status === 'active' ? 'Actif' : 'Inactif'}
              </span>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6">
          {/* Roles Section */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-2 text-slate-600">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Rôles et Permissions</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {user.roles.map((role) => (
                <Badge 
                  key={role} 
                  variant="secondary" 
                  className="text-xs px-3 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                >
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Profile Information */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/30 border-b border-border/50">
          <CardTitle className="text-lg flex items-center space-x-2 text-slate-800">
            <User className="h-5 w-5 text-primary" />
            <span>Informations du Profil</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-slate-50/50 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">Email</p>
                <p className="text-sm text-slate-600">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-slate-50/50 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">Téléphone</p>
                <p className="text-sm text-slate-600">
                  {user.phone || 'Non renseigné'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-slate-50/50 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">Membre depuis</p>
                <p className="text-sm text-slate-600">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-slate-50/50 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">Dernière connexion</p>
                <p className="text-sm text-slate-600">
                  {formatDate(user.lastLoginAt)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Detailed Information */}
      {showDetails && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/30 border-b border-border/50">
            <CardTitle className="text-lg flex items-center space-x-2 text-slate-800">
              <Shield className="h-5 w-5 text-primary" />
              <span>Détails du Compte</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-lg border border-slate-200/50">
                <span className="text-sm font-medium text-slate-700">ID Utilisateur</span>
                <code className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-md font-mono">
                  {user.id}
                </code>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-lg border border-slate-200/50">
                <span className="text-sm font-medium text-slate-700">Dernière mise à jour</span>
                <span className="text-sm text-slate-600">
                  {formatDate(user.updatedAt)}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-lg border border-slate-200/50">
                <span className="text-sm font-medium text-slate-700">Niveau d'accès</span>
                <Badge 
                  variant="default" 
                  className="text-xs px-3 py-1 border-primary/30 text-primary bg-primary/5"
                >
                  {user.isAdmin ? 'Administrateur' : user.isStaff ? 'Staff' : 'Utilisateur'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Quick Actions */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/30">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50/30 border-b border-green-200/50">
          <CardTitle className="text-lg flex items-center space-x-2 text-green-800">
            <Activity className="h-5 w-5 text-green-600" />
            <span>Actions Rapides</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-sm text-green-700 leading-relaxed">
              Utilisez les onglets à droite pour modifier votre profil ou changer votre mot de passe en toute sécurité.
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-green-100/50 rounded-lg">
                <User className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-green-800">Modifier Profil</p>
              </div>
              <div className="text-center p-3 bg-blue-100/50 rounded-lg">
                <Lock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-blue-800">Changer MDP</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
