'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
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
import { Plus, Edit, Trash2, Shield, Users, Settings, Package, Calendar, MessageSquare, Eye, Loader2, X, Zap, Star, UserCheck, Lock, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
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
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [expandedResources, setExpandedResources] = useState<string[]>([]);

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
        toast.success('Rôle créé avec succès!', {
          icon: '✅',
          style: {
            background: '#10b981',
            color: '#ffffff',
          },
        });
        setCreateModalOpen(false);
        setEditingRole({});
        setSelectedPermissions([]);
        
        // Update local state with the new role
        if (createState.data) {
          const newRole: Role = {
            id: createState.data.role.id,
            name: createState.data.role.name,
            description: createState.data.role.description,
            isActive: createState.data.role.isActive,
            permissions: createState.data.permissions.map(p => ({
              id: p.id,
              name: p.name,
              description: null, // Not provided by the service
              resource: p.resource,
              action: p.action,
              isActive: true, // Assume active
            })),
            userCount: 0, // New role has no users initially
          };
          setRoles(prevRoles => [newRole, ...prevRoles]);
        }
      } else if (createState.error) {
        toast.error(createState.error || 'Échec de la création du rôle', {
          icon: '❌',
          style: {
            background: '#ef4444',
            color: '#ffffff',
          },
        });
      }
    }
    previousCreateIsPending.current = createIsPending;
  }, [createIsPending, createState.success, createState.error, createState.data]);

  // Handle update success/error
  useEffect(() => {
    if (previousUpdateIsPending.current && !updateIsPending) {
      if (updateState.success) {
        toast.success('Rôle mis à jour avec succès!', {
          icon: '✅',
          style: {
            background: '#10b981',
            color: '#ffffff',
          },
        });
        setEditModalOpen(false);
        setEditingRole({});
        setSelectedPermissions([]);
        
        // Update local state with the updated role
        if (updateState.data) {
          const updatedRole: Role = {
            id: updateState.data.role.id,
            name: updateState.data.role.name,
            description: updateState.data.role.description,
            isActive: updateState.data.role.isActive,
            permissions: updateState.data.permissions.map(p => ({
              id: p.id,
              name: p.name,
              description: null, // Not provided by the service
              resource: p.resource,
              action: p.action,
              isActive: true, // Assume active
            })),
            userCount: roles.find(r => r.id === updateState.data!.role.id)?.userCount || 0, // Preserve existing user count
          };
          setRoles(prevRoles => 
            prevRoles.map(role => 
              role.id === updatedRole.id ? updatedRole : role
            )
          );
        }
      } else if (updateState.error) {
        toast.error(updateState.error || 'Échec de la mise à jour du rôle', {
          icon: '❌',
          style: {
            background: '#ef4444',
            color: '#ffffff',
          },
        });
      }
    }
    previousUpdateIsPending.current = updateIsPending;
  }, [updateIsPending, updateState.success, updateState.error, updateState.data, roles]);

  // Handle delete success/error
  useEffect(() => {
    if (previousDeleteIsPending.current && !deleteIsPending) {
      if (deleteState.success) {
        toast.success('Rôle supprimé avec succès!', {
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
        toast.error(deleteState.error || 'Échec de la suppression du rôle', {
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
    permissions: <Shield className="h-4 w-4" />,
    settings: <Settings className="h-4 w-4" />,
    about: <Eye className="h-4 w-4" />,
    faqs: <MessageSquare className="h-4 w-4" />,
    home: <Eye className="h-4 w-4" />,
    seo: <Settings className="h-4 w-4" />,
    operations: <Settings className="h-4 w-4" />,
    banners: <Eye className="h-4 w-4" />,
    services: <Package className="h-4 w-4" />,
    dashboard: <Eye className="h-4 w-4" />,
  };

  const resourceLabels: Record<string, string> = {
    products: 'Products',
    categories: 'Categories',
    appointments: 'Appointments',
    customers: 'Customers',
    testimonials: 'Testimonials',
    users: 'Users',
    roles: 'Roles',
    permissions: 'Permissions',
    settings: 'Settings',
    about: 'About',
    faqs: 'FAQs',
    home: 'Home',
    seo: 'SEO',
    operations: 'Operations',
    banners: 'Banners',
    services: 'Services',
    dashboard: 'Dashboard',
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

  // Helper function to get resource label with fallback
  const getResourceLabel = (resource: string): string => {
    return resourceLabels[resource] || resource.charAt(0).toUpperCase() + resource.slice(1);
  };

  // Helper function to get resource icon with fallback
  const getResourceIcon = (resource: string): React.ReactNode => {
    return resourceIcons[resource] || <Settings className="h-4 w-4" />;
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

  // Filter permissions based on search and filters
  const filteredPermissions = useMemo(() => {
    return permissions.filter(permission => {
      // Search filter
      const matchesSearch = !searchTerm || 
        permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.action.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Action filter
      const matchesAction = selectedActions.length === 0 || selectedActions.includes(permission.action);
      
      // Resource filter
      const matchesResource = selectedResources.length === 0 || selectedResources.includes(permission.resource);
      
      return matchesSearch && matchesAction && matchesResource;
    });
  }, [permissions, searchTerm, selectedActions, selectedResources]);

  const groupedPermissions = filteredPermissions.reduce((acc: Record<string, Permission[]>, permission: Permission) => {
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
      const templatePermissionIds = template.permissions.map((permStr: string) => {
        const [resource, action] = permStr.split(':');
        return permissions.find((p: Permission) => p.resource === resource && p.action === action)?.id;
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
    const resourcePermissionIds = resourcePermissions.map((p: Permission) => p.id);
    
    if (select) {
      setSelectedPermissions(prev => [...new Set([...prev, ...resourcePermissionIds])]);
    } else {
      setSelectedPermissions(prev => prev.filter(id => !resourcePermissionIds.includes(id)));
    }
  };

  const handleSelectAllAction = (action: string, select: boolean) => {
    const actionPermissions = filteredPermissions.filter((p: Permission) => p.action === action);
    const actionPermissionIds = actionPermissions.map((p: Permission) => p.id);
    
    if (select) {
      setSelectedPermissions(prev => [...new Set([...prev, ...actionPermissionIds])]);
    } else {
      setSelectedPermissions(prev => prev.filter(id => !actionPermissionIds.includes(id)));
    }
  };

  // Enhanced bulk operations
  const selectByAction = (action: string) => {
    const actionPermissions = filteredPermissions.filter((p: Permission) => p.action === action);
    const actionPermissionIds = actionPermissions.map((p: Permission) => p.id);
    setSelectedPermissions(prev => [...new Set([...prev, ...actionPermissionIds])]);
  };

  const selectByResource = (resource: string) => {
    const resourcePermissions = filteredPermissions.filter((p: Permission) => p.resource === resource);
    const resourcePermissionIds = resourcePermissions.map((p: Permission) => p.id);
    setSelectedPermissions(prev => [...new Set([...prev, ...resourcePermissionIds])]);
  };

  const toggleActionFilter = (action: string) => {
    setSelectedActions(prev => 
      prev.includes(action) 
        ? prev.filter(a => a !== action)
        : [...prev, action]
    );
  };

  const toggleResourceFilter = (resource: string) => {
    setSelectedResources(prev => 
      prev.includes(resource) 
        ? prev.filter(r => r !== resource)
        : [...prev, resource]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedActions([]);
    setSelectedResources([]);
  };

  const toggleResourceExpansion = (resource: string) => {
    setExpandedResources(prev => 
      prev.includes(resource)
        ? prev.filter(r => r !== resource)
        : [...prev, resource]
    );
  };

  const handleCloseCreate = () => {
    if (!createIsPending) {
      setCreateModalOpen(false);
      setEditingRole({});
      setSelectedPermissions([]);
      clearAllFilters();
    }
  };

  const handleCloseEdit = () => {
    if (!updateIsPending) {
      setEditModalOpen(false);
      setEditingRole({});
      setSelectedPermissions([]);
      clearAllFilters();
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
                    <Badge key={permission.id} variant="default" className="text-xs">
                      {resourceLabels[permission.resource]}:{actionLabels[permission.action]}
                    </Badge>
                  ))}
                  {role.permissions.length > 3 && (
                    <Badge variant="default" className="text-xs">
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
                  variant="default"
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
        <DialogContent className="p-0 w-screen h-[100dvh] max-w-none mx-0 overflow-y-auto sm:w-[95vw] sm:max-w-[800px] sm:h-auto sm:max-h-[95vh] sm:mx-0">
          <DialogHeader className="space-y-3 sticky top-0 z-20 bg-background border-b px-4 py-3 sm:px-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-lg sm:text-xl font-semibold text-foreground">
                  Create New Role
                </DialogTitle>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Define a new role with specific permissions
                </p>
              </div>
            </div>
          </DialogHeader>

          <form action={handleCreateSubmit} className="space-y-6 px-4 py-4 sm:px-6 sm:py-6">
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
                    <Badge variant="default" className="text-xs">
                      {getSelectedPermissionsCount()}/{getTotalPermissionsCount()} selected
                    </Badge>
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 h-auto">
                    <TabsTrigger value="templates" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm py-2 px-2 sm:px-4">
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Templates</span>
                      <span className="sm:hidden">Templates</span>
                    </TabsTrigger>
                    <TabsTrigger value="manual" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm py-2 px-2 sm:px-4">
                      <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Manual Selection</span>
                      <span className="sm:hidden">Manual</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="templates" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {Object.entries(PERMISSION_TEMPLATES).map(([key, template]) => (
                        <Card key={key} className="hover:shadow-md transition-shadow cursor-pointer border-border/50">
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex items-start space-x-2 sm:space-x-3">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-xs sm:text-sm">{template.name}</h4>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{template.description}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {template.permissions.slice(0, 2).map((perm, idx) => (
                                    <Badge key={idx} variant="default" className="text-xs px-1 py-0">
                                      {perm}
                                    </Badge>
                                  ))}
                                  {template.permissions.length > 2 && (
                                    <Badge variant="default" className="text-xs px-1 py-0">
                                      +{template.permissions.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="default"
                              size="sm"
                              className="w-full mt-3 text-xs sm:text-sm"
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
                    {/* Search and Filter Section */}
                    <div className="space-y-4">
                      {/* Search Input */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Search permissions..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>

                      {/* Filter Buttons */}
                      <div className="space-y-3">
                        {/* Action Filters */}
                        <div>
                          <Label className="text-xs font-medium text-muted-foreground mb-2 block">Filter by Action</Label>
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {Object.entries(actionLabels).map(([action, label]) => (
                              <Button
                                key={action}
                                type="button"
                                variant={selectedActions.includes(action) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleActionFilter(action)}
                                className="text-xs px-2 py-1 h-auto"
                              >
                                {label}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Resource Filters */}
                        <div>
                          <Label className="text-xs font-medium text-muted-foreground mb-2 block">Filter by Resource</Label>
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {Object.entries(resourceLabels).map(([resource, label]) => (
                              <Button
                                key={resource}
                                type="button"
                                variant={selectedResources.includes(resource) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleResourceFilter(resource)}
                                className="text-xs px-2 py-1 h-auto"
                              >
                                <span className="hidden sm:inline">{getResourceIcon(resource)}</span>
                                <span className="ml-0 sm:ml-1">{label}</span>
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Clear Filters */}
                        {(searchTerm || selectedActions.length > 0 || selectedResources.length > 0) && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={clearAllFilters}
                            className="text-xs"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Clear Filters
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Quick Selection Buttons */}
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => setSelectedPermissions(filteredPermissions.map((p: Permission) => p.id))}
                        className="text-xs px-2 py-1 h-auto"
                      >
                        Select All
                      </Button>
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => setSelectedPermissions([])}
                        className="text-xs px-2 py-1 h-auto"
                      >
                        Clear All
                      </Button>
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => setSelectedPermissions(filteredPermissions.filter((p: Permission) => p.action === 'read').map((p: Permission) => p.id))}
                        className="text-xs px-2 py-1 h-auto"
                      >
                        Read Only
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => selectByAction('create')}
                        className="text-xs px-2 py-1 h-auto"
                      >
                        All Create
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => selectByAction('update')}
                        className="text-xs px-2 py-1 h-auto"
                      >
                        All Update
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => selectByAction('delete')}
                        className="text-xs px-2 py-1 h-auto"
                      >
                        All Delete
                      </Button>
                    </div>

                    {/* Results Summary */}
                    {filteredPermissions.length !== permissions.length && (
                      <div className="text-sm text-muted-foreground">
                        Showing {filteredPermissions.length} of {permissions.length} permissions
                      </div>
                    )}

                    {/* Permissions by Resource */}
                    <div className="space-y-4 max-h-64 sm:max-h-96 overflow-y-auto border rounded-lg p-2 sm:p-4">
                      {Object.keys(groupedPermissions).length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No permissions found matching your criteria</p>
                        </div>
                      ) : (
                      <Accordion type="multiple" className="w-full">
                          {Object.entries(groupedPermissions).map(([resource, perms]) => {
                          const typedPerms = perms as Permission[];
                          return (
                          <AccordionItem key={resource} value={resource} className="border-none">
                            <AccordionTrigger className="p-2 hover:bg-muted/50 rounded-lg">
                              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                                  <span className="hidden sm:inline">{getResourceIcon(resource)}</span>
                                  <h4 className="font-medium text-xs sm:text-sm capitalize truncate">{getResourceLabel(resource)}</h4>
                                <Badge variant="default" className="text-xs flex-shrink-0">
                                    {typedPerms.length}
                                </Badge>
                                  {typedPerms.every((p: Permission) => selectedPermissions.includes(p.id)) && (
                                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                                      All
                                    </Badge>
                                  )}
                              </div>
                            </AccordionTrigger>
                            <div className="flex justify-end mb-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const allSelected = typedPerms.every((p: Permission) => selectedPermissions.includes(p.id));
                                  handleSelectAllResource(resource, !allSelected);
                                }}
                                className="text-xs px-2 py-1 h-auto"
                              >
                                {typedPerms.every((p: Permission) => selectedPermissions.includes(p.id)) ? 'Deselect All' : 'Select All'}
                              </Button>
                            </div>
                            <AccordionContent className="space-y-2 ml-2 sm:ml-6">
                              <div className="grid grid-cols-1 gap-2">
                                {typedPerms.map((permission: Permission) => {
                                  const isCritical = ['delete', 'manage'].includes(permission.action);
                                  const isSelected = selectedPermissions.includes(permission.id);
                                  
                                  return (
                                    <div 
                                      key={permission.id} 
                                      className={`flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 hover:bg-muted/30 rounded-lg transition-colors ${
                                        isSelected ? 'bg-primary/5 border border-primary/20' : ''
                                      } ${isCritical ? 'border-l-2 border-l-orange-400' : ''}`}
                                    >
                                    <Checkbox
                                      id={`create-${permission.id}`}
                                        checked={isSelected}
                                      onCheckedChange={(checked) => handlePermissionToggle(permission.id, checked as boolean)}
                                      disabled={createIsPending}
                                        className="mt-0.5 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                                    />
                                    <Label htmlFor={`create-${permission.id}`} className="flex-1 cursor-pointer min-w-0">
                                        <div className="flex flex-col gap-1">
                                          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                                            <span className="text-xs sm:text-sm font-medium truncate">{permission.name}</span>
                                            {isCritical && (
                                              <Badge variant="destructive" className="text-xs flex-shrink-0">
                                                Critical
                                              </Badge>
                                            )}
                                            <Badge 
                                              variant={permission.action === 'create' ? 'default' : 
                                                      permission.action === 'read' ? 'secondary' :
                                                      permission.action === 'update' ? 'outline' : 'destructive'}
                                              className="text-xs flex-shrink-0"
                                            >
                                          {actionLabels[permission.action]}
                                        </Badge>
                                          </div>
                                      {permission.description && (
                                        <p className="text-xs text-muted-foreground line-clamp-2">{permission.description}</p>
                                      )}
                                      </div>
                                    </Label>
                                  </div>
                                  );
                                })}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                          );
                        })}
                      </Accordion>
                      )}
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

            <DialogFooter className="pt-4 sticky bottom-0 z-20 bg-background border-t px-4 py-3 sm:px-6">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full">
                <Button
                  type="button"
                  onClick={handleCloseCreate}
                  disabled={createIsPending}
                  className="bg-gray-300 text-black font-medium py-2 px-4 sm:px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200 text-sm sm:text-base"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={createIsPending || selectedPermissions.length === 0}
                  className="flex-1 bg-[linear-gradient(to_right,hsl(var(--primary)),hsl(var(--primary)/0.8))] hover:bg-[linear-gradient(to_right,hsl(var(--primary)/0.9),hsl(var(--primary)/0.7))] text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
                >
                  {createIsPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span className="hidden sm:inline">Creating...</span>
                      <span className="sm:hidden">Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Create Role ({selectedPermissions.length} permissions)</span>
                      <span className="sm:hidden">Create ({selectedPermissions.length})</span>
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
        <DialogContent className="p-0 w-screen h-[100dvh] max-w-none mx-0 overflow-y-auto sm:w-[95vw] sm:max-w-[800px] sm:h-auto sm:max-h-[95vh] sm:mx-0">
          <DialogHeader className="space-y-3 sticky top-0 z-20 bg-background border-b px-4 py-3 sm:px-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-lg sm:text-xl font-semibold text-foreground">
                  Edit Role: {editingRole.name}
                </DialogTitle>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Update role details and permissions
                </p>
              </div>
            </div>
          </DialogHeader>

          <form action={handleUpdateSubmit} className="space-y-6 px-4 py-4 sm:px-6 sm:py-6">
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
                    <Badge variant="default" className="text-xs">
                      {getSelectedPermissionsCount()}/{getTotalPermissionsCount()} selected
                    </Badge>
                  </div>
                </div>

                {/* Search and Filter Section */}
                <div className="space-y-4">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search permissions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Filter Buttons */}
                  <div className="space-y-3">
                    {/* Action Filters */}
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground mb-2 block">Filter by Action</Label>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(actionLabels).map(([action, label]) => (
                          <Button
                            key={action}
                            type="button"
                            variant={selectedActions.includes(action) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleActionFilter(action)}
                            className="text-xs"
                          >
                            {label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Resource Filters */}
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground mb-2 block">Filter by Resource</Label>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(resourceLabels).map(([resource, label]) => (
                          <Button
                            key={resource}
                            type="button"
                            variant={selectedResources.includes(resource) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleResourceFilter(resource)}
                            className="text-xs"
                          >
                            {getResourceIcon(resource)}
                            <span className="ml-1">{label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Clear Filters */}
                    {(searchTerm || selectedActions.length > 0 || selectedResources.length > 0) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-xs"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </div>

                {/* Quick Selection Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() => setSelectedPermissions(filteredPermissions.map((p: Permission) => p.id))}
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() => setSelectedPermissions([])}
                  >
                    Clear All
                  </Button>
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() => setSelectedPermissions(filteredPermissions.filter((p: Permission) => p.action === 'read').map((p: Permission) => p.id))}
                  >
                    Read Only
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => selectByAction('create')}
                  >
                    All Create
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => selectByAction('update')}
                  >
                    All Update
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => selectByAction('delete')}
                  >
                    All Delete
                  </Button>
                </div>

                {/* Results Summary */}
                {filteredPermissions.length !== permissions.length && (
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredPermissions.length} of {permissions.length} permissions
                  </div>
                )}

                {/* Permissions by Resource */}
                <div className="space-y-4 max-h-64 sm:max-h-96 overflow-y-auto border rounded-lg p-2 sm:p-4">
                  {Object.keys(groupedPermissions).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No permissions found matching your criteria</p>
                    </div>
                  ) : (
                  <Accordion type="multiple" className="w-full">
                      {Object.entries(groupedPermissions).map(([resource, perms]) => {
                        const typedPerms = perms as Permission[];
                        return (
                      <AccordionItem key={resource} value={resource} className="border-none">
                        <AccordionTrigger className="p-2 hover:bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                              {getResourceIcon(resource)}
                              <h4 className="font-medium text-sm capitalize">{getResourceLabel(resource)}</h4>
                            <Badge variant="default" className="text-xs">
                                {typedPerms.length} permission{typedPerms.length !== 1 ? 's' : ''}
                            </Badge>
                              {typedPerms.every((p: Permission) => selectedPermissions.includes(p.id)) && (
                                <Badge variant="secondary" className="text-xs">
                                  All Selected
                                </Badge>
                              )}
                          </div>
                        </AccordionTrigger>
                        <div className="flex justify-end mb-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                const allSelected = typedPerms.every((p: Permission) => selectedPermissions.includes(p.id));
                              handleSelectAllResource(resource, !allSelected);
                            }}
                            className="text-xs"
                          >
                              {typedPerms.every((p: Permission) => selectedPermissions.includes(p.id)) ? 'Deselect All' : 'Select All'}
                          </Button>
                        </div>
                        <AccordionContent className="space-y-2 ml-6">
                          <div className="grid grid-cols-1 gap-2">
                              {typedPerms.map((permission: Permission) => {
                                const isCritical = ['delete', 'manage'].includes(permission.action);
                                const isSelected = selectedPermissions.includes(permission.id);
                                
                                return (
                                  <div 
                                    key={permission.id} 
                                    className={`flex items-start space-x-3 p-3 hover:bg-muted/30 rounded-lg transition-colors ${
                                      isSelected ? 'bg-primary/5 border border-primary/20' : ''
                                    } ${isCritical ? 'border-l-2 border-l-orange-400' : ''}`}
                                  >
                                <Checkbox
                                  id={`edit-${permission.id}`}
                                      checked={isSelected}
                                  onCheckedChange={(checked) => handlePermissionToggle(permission.id, checked as boolean)}
                                  disabled={updateIsPending}
                                      className="mt-0.5 w-5 h-5"
                                />
                                <Label htmlFor={`edit-${permission.id}`} className="flex-1 cursor-pointer">
                                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-medium">{permission.name}</span>
                                          {isCritical && (
                                            <Badge variant="destructive" className="text-xs">
                                              Critical
                                            </Badge>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Badge 
                                            variant={permission.action === 'create' ? 'default' : 
                                                    permission.action === 'read' ? 'secondary' :
                                                    permission.action === 'update' ? 'outline' : 'destructive'}
                                            className="text-xs"
                                          >
                                      {actionLabels[permission.action]}
                                    </Badge>
                                        </div>
                                  </div>
                                  {permission.description && (
                                    <p className="text-xs text-muted-foreground mt-1">{permission.description}</p>
                                  )}
                                </Label>
                              </div>
                                );
                              })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                        );
                      })}
                  </Accordion>
                  )}
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

            <DialogFooter className="pt-4 sticky bottom-0 z-20 bg-background border-t px-4 py-3 sm:px-6">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full">
                <Button
                  type="button"
                  onClick={handleCloseEdit}
                  disabled={updateIsPending}
                  className="bg-gray-300 text-black font-medium py-2 px-4 sm:px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200 text-sm sm:text-base"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={updateIsPending || selectedPermissions.length === 0}
                  className="flex-1 bg-[linear-gradient(to_right,hsl(var(--primary)),hsl(var(--primary)/0.8))] hover:bg-[linear-gradient(to_right,hsl(var(--primary)/0.9),hsl(var(--primary)/0.7))] text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
                >
                  {updateIsPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span className="hidden sm:inline">Updating...</span>
                      <span className="sm:hidden">Updating...</span>
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Update Role ({selectedPermissions.length} permissions)</span>
                      <span className="sm:hidden">Update ({selectedPermissions.length})</span>
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
        <DialogContent className="p-0 w-screen h-[100dvh] max-w-none mx-0 overflow-y-auto sm:w-[95vw] sm:max-w-md sm:h-auto sm:max-h-[95vh] sm:mx-0">
          <DialogHeader className="space-y-3 sticky top-0 z-20 bg-background border-b px-4 py-3 sm:px-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-lg sm:text-xl font-semibold text-foreground">
                  Delete Role
                </DialogTitle>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  This action cannot be undone
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-orange-800">
                      Are you sure you want to delete <strong>&quot;{selectedRole?.name}&quot;</strong>?
                    </p>
                    <p className="text-xs sm:text-sm text-orange-700 mt-1">
                      This will permanently remove the role from your system. 
                      If the role is assigned to any users, the deletion will be prevented.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {deleteState.error && (
              <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center text-destructive">
                    <X className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">{deleteState.error}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <form action={handleDeleteSubmit}>
            <DialogFooter className="pt-4 sticky bottom-0 z-20 bg-background border-t px-4 py-3 sm:px-6">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full">
                <Button
                  type="button"
                  onClick={handleCloseDelete}
                  disabled={deleteIsPending}
                  className="bg-gray-300 text-black font-medium py-2 px-4 sm:px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200 text-sm sm:text-base"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={deleteIsPending}
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
                >
                  {deleteIsPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span className="hidden sm:inline">Deleting...</span>
                      <span className="sm:hidden">Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Delete Role</span>
                      <span className="sm:hidden">Delete</span>
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
