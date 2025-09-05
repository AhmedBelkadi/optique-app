'use client';

import { useState, useTransition, useEffect } from 'react';
import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { 
  Plus, 
  Loader2, 
  Calendar,
  MessageSquare,
  Clock,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Megaphone,
  Info,
  Edit,
} from 'lucide-react';
import { createBannerAction, deleteBannerAction, toggleBannerAction, updateBannerAction } from '@/features/banners/actions';
import { BannerWithTimestamps } from '@/features/banners/schema/bannerSchema';
import { z } from 'zod';

const bannerFormSchema = z.object({
  text: z.string().min(1, 'Banner message is required').max(500, 'Banner message must be less than 500 characters'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  isActive: z.boolean().default(true),
}).refine((data) => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  return endDate > startDate;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

import { useCSRF } from '@/components/common/CSRFProvider';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import BannerPreview from './BannerPreview';

interface BannerSchedulerProps {
  banners: BannerWithTimestamps[];
}

export default function BannerScheduler({ banners }: BannerSchedulerProps) {
  const { csrfToken, isLoading: csrfLoading, error: csrfError } = useCSRF();
  const [isPending, startTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerWithTimestamps | null>(null);
  const [deletingBannerId, setDeletingBannerId] = useState<string | null>(null);

  const [state, formAction] = useActionState(createBannerAction, {
    success: false,
    error: '',
    fieldErrors: {},
    message: '',
  });

  const [deleteState, deleteAction] = useActionState(deleteBannerAction, {
    success: false,
    error: '',
    message: '',
  });

  const [toggleState, toggleAction] = useActionState(toggleBannerAction, {
    success: false,
    error: '',
    message: '',
  });

  const [updateState, updateAction] = useActionState(updateBannerAction, {
    success: false,
    error: '',
    fieldErrors: {},
    message: '',
  });

  const form = useForm({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      text: '',
      startDate: new Date().toISOString().slice(0, 16),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      isActive: true,
    },
  });

  const handleSubmit = async (data: any) => {
    if (csrfLoading || csrfError) {
      toast.error('CSRF token not available');
      return;
    }

    if (editingBanner) {
      await handleUpdate(data);
    } else {
      startTransition(async () => {
        const formData = new FormData();
        
        // Add CSRF token
        if (csrfToken) {
          formData.append('csrf_token', csrfToken);
        }
        
        // Add form data - using 'text' field to match Prisma schema
        formData.append('text', data.text);
        formData.append('startDate', data.startDate);
        formData.append('endDate', data.endDate);
        formData.append('isActive', data.isActive.toString());

        await formAction(formData);
      });
    }
  };

  const handleDelete = async (bannerId: string) => {
    if (csrfLoading || csrfError) {
      toast.error('CSRF token not available');
      return;
    }

    setDeletingBannerId(bannerId);
    startDeleteTransition(async () => {
      const formData = new FormData();
      
      // Add CSRF token
      if (csrfToken) {
        formData.append('csrf_token', csrfToken);
      }
      
      // Add banner ID
      formData.append('bannerId', bannerId);

      await deleteAction(formData);
    });
  };

  const handleToggle = async (bannerId: string, isActive: boolean) => {
    if (csrfLoading || csrfError) {
      toast.error('CSRF token not available');
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      
      // Add CSRF token
      if (csrfToken) {
        formData.append('csrf_token', csrfToken);
      }
      
      // Add banner data
      formData.append('bannerId', bannerId);
      formData.append('isActive', (!isActive).toString());

      await toggleAction(formData);
    });
  };

  const handleEdit = (banner: BannerWithTimestamps) => {
    setEditingBanner(banner);
    form.reset({
      text: banner.text,
      startDate: new Date(banner.startDate).toISOString().slice(0, 16),
      endDate: new Date(banner.endDate).toISOString().slice(0, 16),
      isActive: banner.isActive,
    });
    setShowForm(true);
  };

  const handleUpdate = async (data: any) => {
    if (!editingBanner || csrfLoading || csrfError) {
      toast.error('CSRF token not available or no banner selected');
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      
      // Add CSRF token
      if (csrfToken) {
        formData.append('csrf_token', csrfToken);
      }
      
      // Add banner data
      formData.append('id', editingBanner.id);
      formData.append('text', data.text);
      formData.append('startDate', data.startDate);
      formData.append('endDate', data.endDate);
      formData.append('isActive', data.isActive.toString());

      await updateAction(formData);
    });
  };

  // Handle state changes with useEffect
  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
      setShowForm(false);
      form.reset();
    }
  }, [state.success, state.message, form]);

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.error]);

  useEffect(() => {
    if (deleteState.success && deleteState.message) {
      toast.success(deleteState.message);
      setDeletingBannerId(null);
    }
  }, [deleteState.success, deleteState.message]);

  useEffect(() => {
    if (deleteState.error) {
      toast.error(deleteState.error);
      setDeletingBannerId(null);
    }
  }, [deleteState.error]);

  useEffect(() => {
    if (toggleState.success && toggleState.message) {
      toast.success(toggleState.message);
    }
  }, [toggleState.success, toggleState.message]);

  useEffect(() => {
    if (toggleState.error) {
      toast.error(toggleState.error);
    }
  }, [toggleState.error]);

  useEffect(() => {
    if (updateState.success && updateState.message) {
      toast.success(updateState.message);
      setShowForm(false);
      setEditingBanner(null);
      form.reset();
    }
  }, [updateState.success, updateState.message, form]);

  useEffect(() => {
    if (updateState.error) {
      toast.error(updateState.error);
    }
  }, [updateState.error]);

  const getBannerStatus = (banner: BannerWithTimestamps) => {
    const now = new Date();
    const startDate = new Date(banner.startDate);
    const endDate = new Date(banner.endDate);

    if (!banner.isActive) {
      return { status: 'inactive', label: 'Inactive', variant: 'secondary' as const, color: 'text-gray-500' };
    }

    if (now < startDate) {
      return { status: 'scheduled', label: 'Scheduled', variant: 'default' as const, color: 'text-blue-600' };
    }

    if (now >= startDate && now <= endDate) {
      return { status: 'active', label: 'Active', variant: 'default' as const, color: 'text-green-600' };
    }

    return { status: 'expired', label: 'Expired', variant: 'secondary' as const, color: 'text-gray-500' };
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeRemaining = (banner: BannerWithTimestamps) => {
    const now = new Date();
    const startDate = new Date(banner.startDate);
    const endDate = new Date(banner.endDate);

    if (now < startDate) {
      const diff = startDate.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      return `Starts in ${days}d ${hours}h`;
    }

    if (now >= startDate && now <= endDate) {
      const diff = endDate.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      return `Ends in ${days}d ${hours}h`;
    }

    return null;
  };

  const activeBanners = banners.filter(banner => banner.isActive);
  const inactiveBanners = banners.filter(banner => !banner.isActive);

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-primary" />
                Banner Scheduler
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Create and manage promotional banners with scheduling
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-xs">
                {activeBanners.length} Active
              </Badge>
              <Badge variant="default" className="text-xs">
                {banners.length} Total
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Create Banner Form */}
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl">
                <Plus className="mr-2 h-4 w-4" />
                Create New Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-primary" />
                  {editingBanner ? 'Edit Banner' : 'Create New Banner'}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Banner Message
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter your promotional message..."
                            className="min-h-[100px] resize-none"
                            maxLength={500}
                            {...field} 
                          />
                        </FormControl>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground">
                            Keep it concise and engaging
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {field.value.length}/500
                          </p>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Start Date & Time
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="datetime-local"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            End Date & Time
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="datetime-local"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Active Status
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Enable this banner immediately
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Banner Preview */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Preview</h4>
                    <BannerPreview 
                      message={form.watch('text') || ''} 
                      isActive={form.watch('isActive') || false} 
                    />
                  </div>

                  {/* Success/Error Messages */}
                  {state.success && (
                    <Alert className="border-emerald-200 bg-emerald-50">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <AlertDescription className="text-emerald-800">
                        {state.message}
                      </AlertDescription>
                    </Alert>
                  )}

                  {state.error && (
                    <Alert className="border-destructive/20 bg-destructive/10">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <AlertDescription className="text-destructive">
                        {state.error}
                      </AlertDescription>
                    </Alert>
                  )}

                                    <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      disabled={isPending || csrfLoading}
                      className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {editingBanner ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          {editingBanner ? 'Update Banner' : 'Create Banner'}
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="default"
                      onClick={() => {
                        setShowForm(false);
                        setEditingBanner(null);
                        form.reset();
                      }}
                      className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Banners List */}
          <div className="space-y-6">
            {/* Active Banners */}
            {activeBanners.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-foreground">Active Banners</h4>
                  <Badge variant="default" className="text-xs">{activeBanners.length}</Badge>
                </div>
                <div className="space-y-3">
                  {activeBanners.map((banner) => {
                    const status = getBannerStatus(banner);
                    const timeRemaining = getTimeRemaining(banner);
                    return (
                      <Card key={banner.id} className="p-4 border-l-4 border-l-green-500 hover:shadow-md transition-all duration-200 group">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                              <Badge variant={status.variant} className={`${status.color} transition-colors`}>
                                {status.label}
                              </Badge>
                              <Eye className="h-4 w-4 text-green-600" />
                              {timeRemaining && (
                                <span className="text-xs text-muted-foreground bg-green-50 px-2 py-1 rounded-full">
                                  {timeRemaining}
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-medium leading-relaxed text-foreground">{banner.text}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md">
                                <Calendar className="h-3 w-3" />
                                Starts: {formatDate(banner.startDate)}
                              </span>
                              <span className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md">
                                <Clock className="h-3 w-3" />
                                Ends: {formatDate(banner.endDate)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(banner)}
                                  className="text-muted-foreground hover:text-foreground hover:bg-muted"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit Banner</TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggle(banner.id, banner.isActive)}
                                  className="text-muted-foreground hover:text-foreground hover:bg-muted"
                                >
                                  <EyeOff className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Deactivate Banner</TooltipContent>
                            </Tooltip>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={isDeletePending && deletingBannerId === banner.id}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  {isDeletePending && deletingBannerId === banner.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Banner</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this banner? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(banner.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete Banner
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Inactive Banners */}
            {inactiveBanners.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-foreground">Inactive Banners</h4>
                  <Badge variant="secondary" className="text-xs">{inactiveBanners.length}</Badge>
                </div>
                <div className="space-y-3">
                  {inactiveBanners.map((banner) => {
                    const status = getBannerStatus(banner);
                    return (
                      <Card key={banner.id} className="p-4 border-l-4 border-l-gray-300 opacity-75 hover:opacity-100 hover:shadow-md transition-all duration-200 group">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                              <Badge variant={status.variant} className={`${status.color} transition-colors`}>
                                {status.label}
                              </Badge>
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium leading-relaxed text-foreground">{banner.text}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md">
                                <Calendar className="h-3 w-3" />
                                Started: {formatDate(banner.startDate)}
                              </span>
                              <span className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md">
                                <Clock className="h-3 w-3" />
                                Ended: {formatDate(banner.endDate)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(banner)}
                                  className="text-muted-foreground hover:text-foreground hover:bg-muted"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit Banner</TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggle(banner.id, banner.isActive)}
                                  className="text-muted-foreground hover:text-foreground hover:bg-muted"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Activate Banner</TooltipContent>
                            </Tooltip>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={isDeletePending && deletingBannerId === banner.id}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  {isDeletePending && deletingBannerId === banner.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Banner</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this banner? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(banner.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete Banner
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {banners.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Megaphone className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-semibold mb-2">No banners yet</h3>
                <p className="text-sm mb-4">Create your first promotional banner to start engaging your visitors</p>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Banner
                </Button>
              </div>
            )}
          </div>


        </CardContent>
      </Card>
    </TooltipProvider>
  );
} 