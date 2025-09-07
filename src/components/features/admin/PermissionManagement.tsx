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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Shield, Search, Filter, Loader2, X, Eye, EyeOff, Package, Users, Calendar, MessageSquare, Settings, FileText } from 'lucide-react';
import { createPermissionAction } from '@/features/auth/actions/createPermission';
import { updatePermissionAction } from '@/features/auth/actions/updatePermission';
import { deletePermissionAction } from '@/features/auth/actions/deletePermission';
import { useCSRF } from '@/components/common/CSRFProvider';
import { formatDateShort } from '@/lib/shared/utils/dateUtils';

interface Permission {
  id: string;
  name: string;
  description: string | null;
  resource: string;
  action: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface PermissionManagementProps {
  permissions: Permission[];
}

const RESOURCE_OPTIONS = [
  { value: 'products', label: 'Products', icon: Package },
  { value: 'categories', label: 'Categories', icon: Package },
  { value: 'appointments', label: 'Appointments', icon: Calendar },
  { value: 'customers', label: 'Customers', icon: Users },
  { value: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  { value: 'users', label: 'Users', icon: Users },
  { value: 'roles', label: 'Roles', icon: Shield },
  { value: 'settings', label: 'Settings', icon: Settings },
  { value: 'content', label: 'Content', icon: FileText },
];

const ACTION_OPTIONS = [
  { value: 'create', label: 'Create' },
  { value: 'read', label: 'Read' },
  { value: 'update', label: 'Update' },
  { value: 'delete', label: 'Delete' },
  { value: 'manage', label: 'Manage' },
  { value: 'approve', label: 'Approve' },
  { value: 'export', label: 'Export' },
  { value: 'import', label: 'Import' },
];

export default function PermissionManagement({ permissions: initialPermissions }: PermissionManagementProps) {
  const { csrfToken } = useCSRF();
  const [permissions, setPermissions] = useState(initialPermissions);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [editingPermission, setEditingPermission] = useState<Partial<Permission>>({});
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [resourceFilter, setResourceFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');

  // Create permission state
  const [createState, createFormAction, createIsPending] = useActionState(createPermissionAction, {
    success: false,
    error: '',
    fieldErrors: {},
    values: {
      name: '',
      description: '',
      resource: '',
      action: '',
    },
  });

  // Update permission state
  const [updateState, updateFormAction, updateIsPending] = useActionState(updatePermissionAction, {
    success: false,
    error: '',
    fieldErrors: {},
    values: {
      name: '',
      description: '',
      resource: '',
      action: '',
    },
  });

  // Delete permission state
  const [deleteState, deleteFormAction, deleteIsPending] = useActionState(deletePermissionAction, {
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
        toast.success('Permission created successfully!', {
          icon: '✅',
          style: {
            background: '#10b981',
            color: '#ffffff',
          },
        });
        setCreateModalOpen(false);
        setEditingPermission({});
        // Refresh the page to get updated permission data
        window.location.reload();
      } else if (createState.error) {
        toast.error(createState.error || 'Failed to create permission', {
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
        toast.success('Permission updated successfully!', {
          icon: '✅',
          style: {
            background: '#10b981',
            color: '#ffffff',
          },
        });
        setEditModalOpen(false);
        setEditingPermission({});
        // Refresh the page to get updated permission data
        window.location.reload();
      } else if (updateState.error) {
        toast.error(updateState.error || 'Failed to update permission', {
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
        toast.success('Permission deleted successfully!', {
          icon: '✅',
          style: {
            background: '#10b981',
            color: '#ffffff',
          },
        });
        setDeleteModalOpen(false);
        setSelectedPermission(null);
        // Remove the deleted permission from local state
        if (selectedPermission) {
          setPermissions(prevPermissions => prevPermissions.filter(p => p.id !== selectedPermission.id));
        }
      } else if (deleteState.error) {
        toast.error(deleteState.error || 'Failed to delete permission', {
          icon: '❌',
          style: {
            background: '#ef4444',
            color: '#ffffff',
          },
        });
      }
    }
    previousDeleteIsPending.current = deleteIsPending;
  }, [deleteIsPending, deleteState.success, deleteState.error, selectedPermission]);

  // Filtered permissions
  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${permission.resource}:${permission.action}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesResource = resourceFilter === 'all' || permission.resource === resourceFilter;
    const matchesAction = actionFilter === 'all' || permission.action === actionFilter;
    
    return matchesSearch && matchesResource && matchesAction;
  });

  const getResourceIcon = (resource: string) => {
    const option = RESOURCE_OPTIONS.find(opt => opt.value === resource);
    return option ? option.icon : Package;
  };

  const getResourceLabel = (resource: string) => {
    const option = RESOURCE_OPTIONS.find(opt => opt.value === resource);
    return option ? option.label : resource;
  };

  const getActionLabel = (action: string) => {
    const option = ACTION_OPTIONS.find(opt => opt.value === action);
    return option ? option.label : action;
  };

  const handleCreatePermission = () => {
    setEditingPermission({});
    setCreateModalOpen(true);
  };

  const handleEditPermission = (permission: Permission) => {
    setEditingPermission(permission);
    setEditModalOpen(true);
  };

  const handleDeletePermission = (permission: Permission) => {
    setSelectedPermission(permission);
    setDeleteModalOpen(true);
  };

  const handleCreateSubmit = (formData: FormData) => {
    if (csrfToken) {
      formData.append('csrf_token', csrfToken);
    }
    createFormAction(formData);
  };

  const handleUpdateSubmit = (formData: FormData) => {
    if (editingPermission.id) {
      formData.append('permissionId', editingPermission.id);
    }
    if (csrfToken) {
      formData.append('csrf_token', csrfToken);
    }
    updateFormAction(formData);
  };

  const handleDeleteSubmit = (formData: FormData) => {
    if (selectedPermission?.id) {
      formData.append('permissionId', selectedPermission.id);
    }
    if (csrfToken) {
      formData.append('csrf_token', csrfToken);
    }
    deleteFormAction(formData);
  };

  const handleCloseCreate = () => {
    if (!createIsPending) {
      setCreateModalOpen(false);
      setEditingPermission({});
    }
  };

  const handleCloseEdit = () => {
    if (!updateIsPending) {
      setEditModalOpen(false);
      setEditingPermission({});
    }
  };

  const handleCloseDelete = () => {
    if (!deleteIsPending) {
      setDeleteModalOpen(false);
      setSelectedPermission(null);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setResourceFilter('all');
    setActionFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Button onClick={handleCreatePermission} className="bg-gradient-to-r from-primary to-primary/80">
          <Plus className="w-4 h-4 mr-2" />
          Create Permission
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-border/50 focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            {/* Resource Filter */}
            <div className="w-full sm:w-48">
              <Select value={resourceFilter} onValueChange={setResourceFilter}>
                <SelectTrigger className="border-border/50 focus:border-primary focus:ring-primary">
                  <SelectValue placeholder="Filter by resource" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Resources</SelectItem>
                  {RESOURCE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action Filter */}
            <div className="w-full sm:w-48">
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="border-border/50 focus:border-primary focus:ring-primary">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {ACTION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            {(searchTerm || resourceFilter !== 'all' || actionFilter !== 'all') && (
              <Button
                variant="default"
                onClick={clearFilters}
                className="border-border/50 hover:bg-muted/50"
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Permissions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPermissions.map((permission) => {
          const ResourceIcon = getResourceIcon(permission.resource);
          return (
            <Card key={permission.id} className="hover:shadow-md transition-shadow border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <ResourceIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">{permission.name}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Shield className="h-3 w-3" />
                        <span>{getResourceLabel(permission.resource)}:{getActionLabel(permission.action)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={permission.isActive ? 'default' : 'secondary'}>
                      {permission.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Description */}
                {permission.description && (
                  <p className="text-sm text-muted-foreground">{permission.description}</p>
                )}

                {/* Resource and Action */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm font-medium">Resource:</Label>
                    <Badge variant="default" className="text-xs">
                      {getResourceLabel(permission.resource)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm font-medium">Action:</Label>
                    <Badge variant="default" className="text-xs">
                      {getActionLabel(permission.action)}
                    </Badge>
                  </div>
                </div>

                {/* Created Date */}
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Created {formatDateShort(permission.createdAt)}</span>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleEditPermission(permission)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeletePermission(permission)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredPermissions.length === 0 && (
        <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              {searchTerm || resourceFilter !== 'all' || actionFilter !== 'all' 
                ? 'No permissions match your filters' 
                : 'No permissions found'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm || resourceFilter !== 'all' || actionFilter !== 'all'
                ? 'Try adjusting your search terms or filters'
                : 'Get started by creating your first permission'}
            </p>
            {(searchTerm || resourceFilter !== 'all' || actionFilter !== 'all') && (
              <Button variant="default" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Permission Modal */}
      <Dialog open={createModalOpen} onOpenChange={handleCloseCreate}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-foreground">
                  Create New Permission
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Define a new system permission
                </p>
              </div>
            </div>
          </DialogHeader>

          <form action={handleCreateSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Permission Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">
                  Permission Name *
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
                  placeholder="e.g., Create Products, Manage Users"
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
                  placeholder="Describe what this permission allows users to do"
                  disabled={createIsPending}
                />
                {createState.fieldErrors?.description && (
                  <p className="text-sm text-destructive flex items-center">
                    <X className="w-4 h-4 mr-1" />
                    {createState.fieldErrors.description[0]}
                  </p>
                )}
              </div>

              {/* Resource */}
              <div className="space-y-2">
                <Label htmlFor="resource" className="text-sm font-medium text-foreground">
                  Resource *
                </Label>
                <Select name="resource" defaultValue={createState.values?.resource || ''}>
                  <SelectTrigger className={`transition-all duration-200 ${
                    createState.fieldErrors?.resource 
                      ? 'border-red-500 focus:border-destructive focus:ring-destructive' 
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}>
                    <SelectValue placeholder="Select a resource" />
                  </SelectTrigger>
                  <SelectContent>
                    {RESOURCE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center space-x-2">
                          <option.icon className="h-4 w-4" />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {createState.fieldErrors?.resource && (
                  <p className="text-sm text-destructive flex items-center">
                    <X className="w-4 h-4 mr-1" />
                    {createState.fieldErrors.resource[0]}
                  </p>
                )}
              </div>

              {/* Action */}
              <div className="space-y-2">
                <Label htmlFor="action" className="text-sm font-medium text-foreground">
                  Action *
                </Label>
                <Select name="action" defaultValue={createState.values?.action || ''}>
                  <SelectTrigger className={`transition-all duration-200 ${
                    createState.fieldErrors?.action 
                      ? 'border-red-500 focus:border-destructive focus:ring-destructive' 
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}>
                    <SelectValue placeholder="Select an action" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {createState.fieldErrors?.action && (
                  <p className="text-sm text-destructive flex items-center">
                    <X className="w-4 h-4 mr-1" />
                    {createState.fieldErrors.action[0]}
                  </p>
                )}
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
                  onClick={handleCloseCreate}
                  disabled={createIsPending}
                  className="flex-1 bg-gray-300 text-black font-medium py-2 px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={createIsPending}
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
                      Create Permission
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Permission Modal */}
      <Dialog open={editModalOpen} onOpenChange={handleCloseEdit}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Edit className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-foreground">
                  Edit Permission: {editingPermission.name}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Update permission details
                </p>
              </div>
            </div>
          </DialogHeader>

          <form action={handleUpdateSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Permission Name */}
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-sm font-medium text-foreground">
                  Permission Name *
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  type="text"
                  required
                  defaultValue={editingPermission.name || ''}
                  className={`transition-all duration-200 ${
                    updateState.fieldErrors?.name 
                      ? 'border-red-500 focus:border-destructive focus:ring-destructive' 
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                  placeholder="e.g., Create Products, Manage Users"
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
                  defaultValue={editingPermission.description || ''}
                  className={`transition-all duration-200 ${
                    updateState.fieldErrors?.description 
                      ? 'border-red-500 focus:border-destructive focus:ring-destructive' 
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                  placeholder="Describe what this permission allows users to do"
                  disabled={updateIsPending}
                />
                {updateState.fieldErrors?.description && (
                  <p className="text-sm text-destructive flex items-center">
                    <X className="w-4 h-4 mr-1" />
                    {updateState.fieldErrors.description[0]}
                  </p>
                )}
              </div>

              {/* Resource */}
              <div className="space-y-2">
                <Label htmlFor="edit-resource" className="text-sm font-medium text-foreground">
                  Resource *
                </Label>
                <Select name="resource" defaultValue={editingPermission.resource || ''}>
                  <SelectTrigger className={`transition-all duration-200 ${
                    updateState.fieldErrors?.resource 
                      ? 'border-red-500 focus:border-destructive focus:ring-destructive' 
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}>
                    <SelectValue placeholder="Select a resource" />
                  </SelectTrigger>
                  <SelectContent>
                    {RESOURCE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center space-x-2">
                          <option.icon className="h-4 w-4" />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {updateState.fieldErrors?.resource && (
                  <p className="text-sm text-destructive flex items-center">
                    <X className="w-4 h-4 mr-1" />
                    {updateState.fieldErrors.resource[0]}
                  </p>
                )}
              </div>

              {/* Action */}
              <div className="space-y-2">
                <Label htmlFor="edit-action" className="text-sm font-medium text-foreground">
                  Action *
                </Label>
                <Select name="action" defaultValue={editingPermission.action || ''}>
                  <SelectTrigger className={`transition-all duration-200 ${
                    updateState.fieldErrors?.action 
                      ? 'border-red-500 focus:border-destructive focus:ring-destructive' 
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}>
                    <SelectValue placeholder="Select an action" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {updateState.fieldErrors?.action && (
                  <p className="text-sm text-destructive flex items-center">
                    <X className="w-4 h-4 mr-1" />
                    {updateState.fieldErrors.action[0]}
                  </p>
                )}
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
                  onClick={handleCloseEdit}
                  disabled={updateIsPending}
                  className="flex-1 bg-gray-300 text-black font-medium py-2 px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={updateIsPending}
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
                      Update Permission
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Permission Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={handleCloseDelete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-foreground">
                  Delete Permission
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
                      Are you sure you want to delete <strong>&quot;{selectedPermission?.name}&quot;</strong>?
                    </p>
                    <p className="text-sm text-orange-700 mt-1">
                      This will permanently remove the permission from your system. 
                      If the permission is assigned to any roles, the deletion will be prevented.
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
                  onClick={handleCloseDelete}
                  disabled={deleteIsPending}
                  className="bg-gray-300 text-black font-medium py-2 px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200"

                >
                  Annuler
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
                      Delete Permission
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
