'use client';

import { useState, useCallback, useEffect } from 'react';
import { UserWithRoles } from '@/features/users/queries/getAllUsers';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import UserGrid from './UserGrid';
import CreateUserModal from './CreateUserModal';

interface UsersContainerProps {
  users: UserWithRoles[];
  roles: Array<{ id: string; name: string }>;
}

export default function UsersContainer({ users: initialUsers, roles }: UsersContainerProps) {

  
  const [users, setUsers] = useState<UserWithRoles[]>(initialUsers);
  const [createModalOpen, setCreateModalOpen] = useState(false);


  // Handle user creation success
  const handleCreateSuccess = useCallback((newUser: UserWithRoles) => {
    setUsers(prev => {
      const newUsers = [newUser, ...prev];
      return newUsers;
    });
    setCreateModalOpen(false);
  }, []);

  // Handle user update success (role, status, etc.)
  const handleUserUpdated = useCallback((updatedUser: UserWithRoles) => {
    setUsers(prev => 
      prev.map(user => user.id === updatedUser.id ? updatedUser : user)
    );
  }, []);

  return (
    <div className="space-y-6">
      {/* Create User Button */}
      <div className="flex justify-end">
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      {/* Users Grid */}
      <UserGrid 
        users={users} 
        roles={roles}
        onUserUpdated={handleUserUpdated}
      />

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
