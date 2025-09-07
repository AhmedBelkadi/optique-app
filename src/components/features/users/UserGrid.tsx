'use client';

import { useState } from 'react';
import { UserWithRoles } from '@/features/users/queries/getAllUsers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, User as UserIcon, Mail, Calendar } from 'lucide-react';
import { updateUserRoleAction } from '@/features/users/actions/updateUserRole';
import { updateUserStatusAction } from '@/features/users/actions/updateUserStatus';
import { formatDateShort } from '@/lib/shared/utils/dateUtils';
import { toast } from 'react-hot-toast';
import { useCSRF } from '@/components/common/CSRFProvider';

interface UserGridProps {
  users: UserWithRoles[];
  roles: Array<{ id: string; name: string }>;
  onUserUpdated: (updatedUser: UserWithRoles) => void;
}

export default function UserGrid({ users, roles, onUserUpdated }: UserGridProps) {
  const { csrfToken } = useCSRF();

  const handleRoleUpdate = async (userId: string, newRoleId: string) => {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('role', newRoleId);
    
    // Add CSRF token to form data
    if (csrfToken) {
      formData.append('csrf_token', csrfToken);
    }

    const result = await updateUserRoleAction({}, formData);
    
    if (result.success) {
      toast.success('Rôle utilisateur mis à jour avec succès');
      
      // Update local state instead of reloading
      const updatedUser = users.find(user => user.id === userId);
      if (updatedUser) {
        const newRole = roles.find(r => r.id === newRoleId);
        if (newRole) {
          const newUser: UserWithRoles = {
            ...updatedUser,
            userRoles: [{
              id: `temp-${Date.now()}`, // Temporary ID for UI update
              roleId: newRoleId,
              role: {
                id: newRole.id,
                name: newRole.name,
                description: null
              }
            }]
          };
          onUserUpdated(newUser);
        }
      }
    } else {
      toast.error(result.error || 'Échec de la mise à jour du rôle utilisateur');
    }
  };

  const handleStatusToggle = async (userId: string, isActive: boolean) => {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('isActive', isActive.toString());
    
    // Add CSRF token to form data
    if (csrfToken) {
      formData.append('csrf_token', csrfToken);
    }

    const result = await updateUserStatusAction({}, formData);
    
    if (result.success) {
      toast.success(`Utilisateur ${isActive ? 'activé' : 'désactivé'} avec succès`);
      
      // Update local state instead of reloading
      const updatedUser = users.find(user => user.id === userId);
      if (updatedUser) {
        const newUser = { ...updatedUser, isActive };
        onUserUpdated(newUser);
      }
    } else {
      toast.error(result.error || 'Échec de la mise à jour du statut utilisateur');
    }
  };

  const getRoleBadgeVariant = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'admin':
        return 'destructive';
      case 'staff':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getStatusBadgeVariant = (isActive: boolean) => {
    return isActive ? 'default' : 'destructive';
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <UserIcon className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-semibold text-muted-foreground">Aucun utilisateur trouvé</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Commencez par créer votre premier membre du personnel.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">{user.name}</CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusBadgeVariant(user.isActive)}>
                    {user.isActive ? 'Actif' : 'Inactif'}
                  </Badge>
                  {!user.isActive && (
                    <Badge variant="secondary" className="text-xs">
                      Désactivé
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Roles */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Rôles</Label>
                <div className="flex flex-wrap gap-2">
                  {user.userRoles.map((userRole) => (
                    <Badge
                      key={userRole.roleId}
                      variant={getRoleBadgeVariant(userRole.role.name)}
                      className="flex items-center space-x-1"
                    >
                      <Shield className="h-3 w-3" />
                      {userRole.role.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Role Management */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Mettre à Jour le Rôle</Label>
                <Select
                  key={`role-${user.id}`}
                  onValueChange={(value) => handleRoleUpdate(user.id, value)}
                  value={user.userRoles[0]?.role?.id || ''}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Statut du Compte</Label>
                <Switch
                  key={`status-${user.id}`}
                  checked={user.isActive}
                  onCheckedChange={(checked) => handleStatusToggle(user.id, checked)}
                  disabled={user.userRoles.some(ur => ur.role.name === 'admin')}
                />
              </div>

              {/* Created Date */}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Créé le {formatDateShort(user.createdAt)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
