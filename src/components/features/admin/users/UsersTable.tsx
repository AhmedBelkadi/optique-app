'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, UserCheck, Shield } from 'lucide-react';
import { updateUserRoleAction } from '@/features/users/actions/updateUserRole';
import { formatDateShort } from '@/lib/shared/utils/dateUtils';


interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  isActive: boolean;
  createdAt: Date;
}

interface UsersTableProps {
  currentUser?: any;
}

export default function UsersTable({ currentUser }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });

      if (response.ok) {
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'destructive';
      case 'staff':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 border-b">
          <div className="col-span-4 font-medium">User</div>
          <div className="col-span-3 font-medium">Roles</div>
          <div className="col-span-2 font-medium">Status</div>
          <div className="col-span-2 font-medium">Created</div>
          <div className="col-span-1 font-medium">Actions</div>
        </div>

        {users.map((user) => (
          <div key={user.id} className="grid grid-cols-12 gap-4 p-4 border-b last:border-b-0 items-center">
            {/* User Info */}
            <div className="col-span-4 flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" alt={user.name} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
              </div>
            </div>

            {/* Roles */}
            <div className="col-span-3 flex flex-wrap gap-1">
              {user.roles.map((role) => (
                <Badge key={role} variant={getRoleBadgeVariant(role)}>
                  {role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                  {role === 'staff' && <UserCheck className="w-3 h-3 mr-1" />}
                  {role}
                </Badge>
              ))}
            </div>

            {/* Status */}
            <div className="col-span-2">
              <Badge variant={user.isActive ? 'default' : 'secondary'}>
                {user.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            {/* Created Date */}
            <div className="col-span-2 text-sm text-muted-foreground">
              {formatDateShort(user.createdAt)}
            </div>

            {/* Actions */}
            <div className="col-span-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Role Management */}
                  <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'staff')}>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Make Staff
                  </DropdownMenuItem>
                  
                  {currentUser?.isAdmin && (
                    <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'admin')}>
                      <Shield className="mr-2 h-4 w-4" />
                      Make Admin
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  
                  {/* Status Management */}
                  <DropdownMenuItem onClick={() => handleToggleStatus(user.id, !user.isActive)}>
                    {user.isActive ? (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Activate
                      </>
                    )}
                  </DropdownMenuItem>
                  
                  {/* Edit User */}
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No users found. Create the first staff account to get started.
        </div>
      )}
    </div>
  );
}
