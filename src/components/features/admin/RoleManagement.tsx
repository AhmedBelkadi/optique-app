'use client';

import { useState, useEffect, useRef } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Edit, Trash2, Shield, Users, Settings, Package, Calendar, MessageSquare, Eye, Loader2, X, Zap, Star, UserCheck, Lock } from 'lucide-react';
import { createRoleAction } from '@/features/auth/actions/createRole';
import { updateRoleAction } from '@/features/auth/actions/updateRole';
import { deleteRoleAction } from '@/features/auth/actions/deleteRole';
import { useCSRF } from '@/components/common/CSRFProvider';

interface Permission {
  id: string;
  name: string;
  description: string | null;
  resource: string;
  action: string;
  isActive: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  permissions: Permission[];
  userCount: number;
}

interface RoleManagementProps {
  roles: Role[];
  permissions: Permission[];
}

// Permission templates for common role types
const PERMISSION_TEMPLATES = {
  'content-editor': {
    name: 'Content Editor',
    description: 'Can create, edit, and manage content but cannot delete',
    permissions: ['products:read', 'products:update', 'categories:read', 'categories:update', 'content:read', 'content:update']
  },
  'content-manager': {
    name: 'Content Manager',
    description: 'Full content management including creation and deletion',
    permissions: ['products:create', 'products:read', 'products:update', 'products:delete', 'categories:create', 'categories:read', 'categories:update', 'categories:delete', 'content:manage']
  },
  'customer-service': {
    name: 'Customer Service',
    description: 'Can manage customers and appointments',
    permissions: ['customers:read', 'customers:update', 'appointments:read', 'appointments:update', 'testimonials:read']
  },
  'viewer': {
    name: 'Viewer',
    description: 'Read-only access to public content',
    permissions: ['products:read', 'categories:read', 'content:read']
  }
};

export default function RoleManagement({ roles: initialRoles, permissions }: RoleManagementProps) {
  const { csrfToken } = useCSRF();
  const [roles, setRoles] = useState(initialRoles);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editingRole, setEditingRole] = useState<Partial<Role>>({});
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('manual');

  // Create role state
  const [createState, createFormAction, createIsPending] = useActionState(createRoleAction, {
    success: false,
    error: '',
    fieldErrors: {},
    values: {
      name: '',
      description: '',
      permissions: [],
    },
  });

  // Update role state
  const [updateState, updateFormAction, updateIsPending] = useActionState(updateRoleAction, {
    success: false,
    error: '',
    fieldErrors: {},
    values: {
      name: '',
      description: '',
      permissions: [],
    },
  });

  // Delete role state
  const [deleteState, deleteFormAction, deleteIsPending] = useActionState(deleteRoleAction, {
    success: false,
    error: '',
  });

  // Refs for tracking pending states
  const previousCreateIsPending = useRef(false);
  const previousUpdateIsPending = useRef(false);
  const previousDeleteIsPending = useRef(false);

  // Handle create success/error
  useEffect(() => {
    if (previousCreateIsPending.current && !createIsPending) {
      if (createState.success) {
        toast.success('Role created successfully!', {
          icon: '✅',
          style: {
            background: '#10b981',
            color: '#ffffff',
          },
        });
        setCreateModalOpen(false);
        setEditingRole({});
        setSelectedPermissions([]);
        // For create, we need to refresh to get the new role with proper permissions
        window.location.reload();
      } else if (createState.error) {
        toast.error(createState.error || 'Failed to create role', {
          icon: '❌',
          style: {
            background: '#ef4444',
            color: '#ffffff',
          },
        });
      }
    }
    previousCreateIsPending.current = createIsPending;
  }, [createIsPending, createState.success, createState.error]);

  // Handle update success/error
  useEffect(() => {
    if (previousUpdateIsPending.current && !updateIsPending) {
      if (updateState.success) {
        toast.success('Role updated successfully!', {
          icon: '✅',
          style: {
            background: '#10b981',
            color: '#ffffff',
          },
        });
        setEditModalOpen(false);
        setEditingRole({});
        setSelectedPermissions([]);
        // Refresh the page to get updated role data
        window.location.reload();
      } else if (updateState.error) {
        toast.error(updateState.error || 'Failed to update role', {
          icon: '❌',
          style: {
            background: '#ef4444',
            color: '#ffffff',
          },
        });
      }
    }
    previousUpdateIsPending.current = updateIsPending;
  }, [updateIsPending, updateState.success, updateState.error]);

  // Handle delete success/error
  useEffect(() => {
    if (previousDeleteIsPending.current && !deleteIsPending) {
      if (deleteState.success) {
        toast.success('Role deleted successfully!', {
          icon: '✅',
          style: {
            background: '#10b981',
            color: '#ffffff',
          },
        });
        setDeleteModalOpen(false);
        setSelectedRole(null);
        // Remove the deleted role from local state
        if (selectedRole) {
          setRoles(prevRoles => prevRoles.filter(role => role.id !== selectedRole.id));
        }
      } else if (deleteState.error) {
        toast.error(deleteState.error || 'Failed to delete role', {
          icon: '❌',
          style: {
            background: '#ef4444',
            color: '#ffffff',
          },
        });
      }
    }
    previousDeleteIsPending.current = deleteIsPending;
  }, [deleteIsPending, deleteState.success, deleteState.error, selectedRole]);

  const resourceIcons: Record<string, React.ReactNode> = {
    products: <Package className="h-4 w-4" />,
    categories: <Package className="h-4 w-4" />,
    appointments: <Calendar className="h-4 w-4" />,
    customers: <Users className="h-4 w-4" />,
    testimonials: <MessageSquare className="h-4 w-4" />,
    users: <Users className="h-4 w-4" />,
    roles: <Shield className="h-4 w-4" />,
    settings: <Settings className="h-4 w-4" />,
    content: <Eye className="h-4 w-4" />,
  };

  const resourceLabels: Record<string, string> = {
    products: 'Products',
    categories: 'Categories',
    appointments: 'Appointments',
    customers: 'Customers',
    testimonials: 'Testimonials',
    users: 'Users',
    roles: 'Roles',
    settings: 'Settings',
    content: 'Content',
  };

  const actionLabels: Record<string, string> = {
    create: 'Create',
    read: 'Read',
    update: 'Update',
    delete: 'Delete',
    manage: 'Manage',
    approve: 'Approve',
    export: 'Export',
    import: 'Import',
  };

  const handleCreateRole = () => {
    setEditingRole({});
    setSelectedPermissions([]);
    setActiveTab('manual');
    setCreateModalOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setSelectedPermissions(role.permissions.map(p => p.id));
    setActiveTab('manual');
    setEditModalOpen(true);
  };

  const handleDeleteRole = (role: Role) => {
    setSelectedRole(role);
    setDeleteModalOpen(true);
  };

  const handleCreateSubmit = (formData: FormData) => {
    // Add selected permissions to form data
    selectedPermissions.forEach(permissionId => {
      formData.append('permissions', permissionId);
    });
    
    // Add CSRF token to form data
    if (csrfToken) {
      formData.append('csrf_token', csrfToken);
    }
    createFormAction(formData);
  };

  const handleUpdateSubmit = (formData: FormData) => {
    // Add selected permissions to form data
    selectedPermissions.forEach(permissionId => {
      formData.append('permissions', permissionId);
    });

    // Add role ID and CSRF token to form data
    if (editingRole.id) {
      formData.append('roleId', editingRole.id);
    }
    if (csrfToken) {
      formData.append('csrf_token', csrfToken);
    }
    updateFormAction(formData);
  };

  const handleDeleteSubmit = (formData: FormData) => {
    // Add role ID and CSRF token to form data
    if (selectedRole?.id) {
      formData.append('roleId', selectedRole.id);
    }
    if (csrfToken) {
      formData.append('csrf_token', csrfToken);
    }
    deleteFormAction(formData);
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = [];
    }
    acc[permission.resource].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const handleTemplateSelect = (templateKey: string) => {
    const template = PERMISSION_TEMPLATES[templateKey as keyof typeof PERMISSION_TEMPLATES];
    if (template) {
      // Find permission IDs that match the template
      const templatePermissionIds = template.permissions.map(permStr => {
        const [resource, action] = permStr.split(':');
        return permissions.find(p => p.resource === resource && p.action === action)?.id;
      }).filter(Boolean) as string[];
      
      setSelectedPermissions(templatePermissionIds);
      setActiveTab('manual');
      toast.success(`Applied ${template.name} template with ${templatePermissionIds.length} permissions`, {
        icon: '✨',
        style: {
          background: '#10b981',
          color: '#ffffff',
        },
      });
    }
  };

  const handlePermissionToggle = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions(prev => [...prev, permissionId]);
    } else {
      setSelectedPermissions(prev => prev.filter(id => id !== permissionId));
    }
  };

  const handleSelectAllResource = (resource: string, select: boolean) => {
    const resourcePermissions = groupedPermissions[resource] || [];
    const resourcePermissionIds = resourcePermissions.map(p => p.id);
    
    if (select) {
      setSelectedPermissions(prev => [...new Set([...prev, ...resourcePermissionIds])]);
    } else {
      setSelectedPermissions(prev => prev.filter(id => !resourcePermissionIds.includes(id)));
    }
  };

  const handleSelectAllAction = (action: string, select: boolean) => {
    const actionPermissions = permissions.filter(p => p.action === action);
    const actionPermissionIds = actionPermissions.map(p => p.id);
    
    if (select) {
      setSelectedPermissions(prev => [...new Set([...prev, ...actionPermissionIds])]);
    } else {
      setSelectedPermissions(prev => prev.filter(id => !actionPermissionIds.includes(id)));
    }
  };

  const handleCloseCreate = () => {
    if (!createIsPending) {
      setCreateModalOpen(false);
      setEditingRole({});
      setSelectedPermissions([]);
    }
  };

  const handleCloseEdit = () => {
    if (!updateIsPending) {
      setEditModalOpen(false);
      setEditingRole({});
      setSelectedPermissions([]);
    }
  };

  const handleCloseDelete = () => {
    if (!deleteIsPending) {
      setDeleteModalOpen(false);
      setSelectedRole(null);
    }
  };

  const getSelectedPermissionsCount = () => selectedPermissions.length;
  const getTotalPermissionsCount = () => permissions.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Button onClick={handleCreateRole} className="bg-gradient-to-r from-primary to-primary/80">
          <Plus className="w-4 h-4 mr-2" />
          Create Role
        </Button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Card key={role.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">{role.name}</CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{role.userCount} user(s)</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={role.isActive ? 'default' : 'secondary'}>
                    {role.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Description */}
              {role.description && (
                <p className="text-sm text-muted-foreground">{role.description}</p>
              )}

              {/* Permissions Summary */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Permissions</Label>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 3).map((permission) => (
                    <Badge key={permission.id} variant="outline" className="text-xs">
                      {resourceLabels[permission.resource]}:{actionLabels[permission.action]}
                    </Badge>
                  ))}
                  {role.permissions.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{role.permissions.length - 3} more
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total: {role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditRole(role)}
                  disabled={role.name === 'admin'}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteRole(role)}
                  disabled={role.name === 'admin' || role.userCount > 0}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Role Modal */}
      <Dialog open={createModalOpen} onOpenChange={handleCloseCreate}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-foreground">
                  Create New Role
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Define a new role with specific permissions
                </p>
              </div>
            </div>
          </DialogHeader>

          <form action={handleCreateSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Role Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">
                  Role Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  defaultValue={createState.values?.name || ''}
                  className={`transition-all duration-200 ${
                    createState.fieldErrors?.name 
                      ? 'border-red-500 focus:border-destructive focus:ring-destructive' 
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                  placeholder="e.g., Content Manager, Customer Service, Viewer"
                  disabled={createIsPending}
                />
                {createState.fieldErrors?.name && (
                  <p className="text-sm text-destructive flex items-center">
                    <X className="w-4 h-4 mr-1" />
                    {createState.fieldErrors.name[0]}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-foreground">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={3}
                  defaultValue={createState.values?.description || ''}
                  className={`transition-all duration-200 ${
                    createState.fieldErrors?.description 
                      ? 'border-red-500 focus:border-destructive focus:ring-destructive' 
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                  placeholder="Describe this role's purpose and responsibilities"
                  disabled={createIsPending}
                />
                {createState.fieldErrors?.description && (
                  <p className="text-sm text-destructive flex items-center">
                    <X className="w-4 h-4 mr-1" />
                    {createState.fieldErrors.description[0]}
                  </p>
                )}
              </div>

              {/* Permission Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-foreground">Permissions</Label>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {getSelectedPermissionsCount()}/{getTotalPermissionsCount()} selected
                    </Badge>
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="templates" className="flex items-center space-x-2">
                      <Zap className="w-4 h-4" />
                      <span>Templates</span>
                    </TabsTrigger>
                    <TabsTrigger value="manual" className="flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Manual Selection</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="templates" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(PERMISSION_TEMPLATES).map(([key, template]) => (
                        <Card key={key} className="hover:shadow-md transition-shadow cursor-pointer border-border/50">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Star className="w-4 h-4 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{template.name}</h4>
                                <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {template.permissions.slice(0, 3).map((perm, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {perm}
                                    </Badge>
                                  ))}
                                  {template.permissions.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{template.permissions.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="w-full mt-3"
                              onClick={() => handleTemplateSelect(key)}
                            >
                              Use Template
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="manual" className="space-y-4 mt-4">
                    {/* Quick Selection Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPermissions(permissions.map(p => p.id))}
                      >
                        Select All
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPermissions([])}
                      >
                        Clear All
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPermissions(permissions.filter(p => p.action === 'read').map(p => p.id))}
                      >
                        Read Only
                      </Button>
                    </div>

                    {/* Permissions by Resource */}
                    <div className="space-y-4 max-h-96 overflow-y-auto border rounded-lg p-4">
                      <Accordion type="multiple" className="w-full">
                        {Object.entries(groupedPermissions).map(([resource, perms]) => (
                          <AccordionItem key={resource} value={resource} className="border-none">
                            <AccordionTrigger className="p-2 hover:bg-muted/50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                {resourceIcons[resource] || <Settings className="h-4 w-4" />}
                                <h4 className="font-medium text-sm capitalize">{resourceLabels[resource]}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {perms.length} permission{perms.length !== 1 ? 's' : ''}
                                </Badge>
                              </div>
                            </AccordionTrigger>
                            <div className="flex justify-end mb-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const allSelected = perms.every(p => selectedPermissions.includes(p.id));
                                  handleSelectAllResource(resource, !allSelected);
                                }}
                                className="text-xs"
                              >
                                {perms.every(p => selectedPermissions.includes(p.id)) ? 'Deselect All' : 'Select All'}
                              </Button>
                            </div>
                            <AccordionContent className="space-y-2 ml-6">
                              <div className="grid grid-cols-1 gap-2">
                                {perms.map((permission) => (
                                  <div key={permission.id} className="flex items-center space-x-3 p-2 hover:bg-muted/30 rounded-lg">
                                    <Checkbox
                                      id={`create-${permission.id}`}
                                      checked={selectedPermissions.includes(permission.id)}
                                      onCheckedChange={(checked) => handlePermissionToggle(permission.id, checked as boolean)}
                                      disabled={createIsPending}
                                    />
                                    <Label htmlFor={`create-${permission.id}`} className="flex-1 cursor-pointer">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm">{permission.name}</span>
                                        <Badge variant="outline" className="text-xs ml-2">
                                          {actionLabels[permission.action]}
                                        </Badge>
                                      </div>
                                      {permission.description && (
                                        <p className="text-xs text-muted-foreground mt-1">{permission.description}</p>
                                      )}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {createState.error && (
              <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="p-4">
                  <div className="flex items-center text-destructive">
                    <X className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{createState.error}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <DialogFooter className="pt-4">
              <div className="flex space-x-3 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseCreate}
                  disabled={createIsPending}
                  className="flex-1 bg-background/50 backdrop-blur-sm border-border hover:bg-muted/50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createIsPending || selectedPermissions.length === 0}
                  className="flex-1 bg-[linear-gradient(to_right,hsl(var(--primary)),hsl(var(--primary)/0.8))] hover:bg-[linear-gradient(to_right,hsl(var(--primary)/0.9),hsl(var(--primary)/0.7))] text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {createIsPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Role ({selectedPermissions.length} permissions)
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Role Modal */}
      <Dialog open={editModalOpen} onOpenChange={handleCloseEdit}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Edit className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-foreground">
                  Edit Role: {editingRole.name}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Update role details and permissions
                </p>
              </div>
            </div>
          </DialogHeader>

          <form action={handleUpdateSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Role Name */}
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-sm font-medium text-foreground">
                  Role Name *
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  type="text"
                  required
                  defaultValue={editingRole.name || ''}
                  className={`transition-all duration-200 ${
                    updateState.fieldErrors?.name 
                      ? 'border-red-500 focus:border-destructive focus:ring-destructive' 
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                  placeholder="e.g., Content Manager, Customer Service, Viewer"
                  disabled={updateIsPending}
                />
                {updateState.fieldErrors?.name && (
                  <p className="text-sm text-destructive flex items-center">
                    <X className="w-4 h-4 mr-1" />
                    {updateState.fieldErrors.name[0]}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-sm font-medium text-foreground">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  rows={3}
                  defaultValue={editingRole.description || ''}
                  className={`transition-all duration-200 ${
                    updateState.fieldErrors?.description 
                      ? 'border-red-500 focus:border-destructive focus:ring-destructive' 
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                  placeholder="Describe this role's purpose and responsibilities"
                  disabled={updateIsPending}
                />
                {updateState.fieldErrors?.description && (
                  <p className="text-sm text-destructive flex items-center">
                    <X className="w-4 h-4 mr-1" />
                    {updateState.fieldErrors.description[0]}
                  </p>
                )}
              </div>

              {/* Permission Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-foreground">Permissions</Label>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {getSelectedPermissionsCount()}/{getTotalPermissionsCount()} selected
                    </Badge>
                  </div>
                </div>

                {/* Quick Selection Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPermissions(permissions.map(p => p.id))}
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPermissions([])}
                  >
                    Clear All
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPermissions(permissions.filter(p => p.action === 'read').map(p => p.id))}
                  >
                    Read Only
                  </Button>
                </div>

                {/* Permissions by Resource */}
                <div className="space-y-4 max-h-96 overflow-y-auto border rounded-lg p-4">
                  <Accordion type="multiple" className="w-full">
                    {Object.entries(groupedPermissions).map(([resource, perms]) => (
                      <AccordionItem key={resource} value={resource} className="border-none">
                        <AccordionTrigger className="p-2 hover:bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {resourceIcons[resource] || <Settings className="h-4 w-4" />}
                            <h4 className="font-medium text-sm capitalize">{resourceLabels[resource]}</h4>
                            <Badge variant="outline" className="text-xs">
                              {perms.length} permission{perms.length !== 1 ? 's' : ''}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <div className="flex justify-end mb-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const allSelected = perms.every(p => selectedPermissions.includes(p.id));
                              handleSelectAllResource(resource, !allSelected);
                            }}
                            className="text-xs"
                          >
                            {perms.every(p => selectedPermissions.includes(p.id)) ? 'Deselect All' : 'Select All'}
                          </Button>
                        </div>
                        <AccordionContent className="space-y-2 ml-6">
                          <div className="grid grid-cols-1 gap-2">
                            {perms.map((permission) => (
                              <div key={permission.id} className="flex items-center space-x-2 p-2 hover:bg-muted/30 rounded-lg">
                                <Checkbox
                                  id={`edit-${permission.id}`}
                                  checked={selectedPermissions.includes(permission.id)}
                                  onCheckedChange={(checked) => handlePermissionToggle(permission.id, checked as boolean)}
                                  disabled={updateIsPending}
                                />
                                <Label htmlFor={`edit-${permission.id}`} className="flex-1 cursor-pointer">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm">{permission.name}</span>
                                    <Badge variant="outline" className="text-xs ml-2">
                                      {actionLabels[permission.action]}
                                    </Badge>
                                  </div>
                                  {permission.description && (
                                    <p className="text-xs text-muted-foreground mt-1">{permission.description}</p>
                                  )}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </div>

            {updateState.error && (
              <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="p-4">
                  <div className="flex items-center text-destructive">
                    <X className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{updateState.error}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <DialogFooter className="pt-4">
              <div className="flex space-x-3 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseEdit}
                  disabled={updateIsPending}
                  className="flex-1 bg-background/50 backdrop-blur-sm border-border hover:bg-muted/50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateIsPending || selectedPermissions.length === 0}
                  className="flex-1 bg-[linear-gradient(to_right,hsl(var(--primary)),hsl(var(--primary)/0.8))] hover:bg-[linear-gradient(to_right,hsl(var(--primary)/0.9),hsl(var(--primary)/0.7))] text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {updateIsPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Update Role ({selectedPermissions.length} permissions)
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Role Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={handleCloseDelete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-foreground">
                  Delete Role
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  This action cannot be undone
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Trash2 className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">
                      Are you sure you want to delete <strong>&quot;{selectedRole?.name}&quot;</strong>?
                    </p>
                    <p className="text-sm text-orange-700 mt-1">
                      This will permanently remove the role from your system. 
                      If the role is assigned to any users, the deletion will be prevented.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {deleteState.error && (
              <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="p-4">
                  <div className="flex items-center text-destructive">
                    <X className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{deleteState.error}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <form action={handleDeleteSubmit}>
            <DialogFooter className="pt-4">
              <div className="flex space-x-3 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDelete}
                  disabled={deleteIsPending}
                  className="flex-1 bg-background/50 backdrop-blur-sm border-border hover:bg-muted/50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={deleteIsPending}
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {deleteIsPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Role
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
