'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { useActionState } from 'react';
import { Service } from '@/features/services/schema/serviceSchema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Eye, 
  EyeOff, 
  GripVertical
} from 'lucide-react';
import { ServiceForm } from './ServiceForm';
import { deleteServiceAction, DeleteServiceState } from '@/features/services/actions/deleteServiceAction';
import { reorderServicesAction, ReorderServicesState } from '@/features/services/actions/reorderServicesAction';
import { useCSRF } from '@/components/common/CSRFProvider';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';

const SortableList = dynamic(() => import('../cms/SortableList'), {
  ssr: false,
  loading: () => <div className="space-y-3">Loading...</div>
}) as <T>(props: {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  getId: (item: T) => string;
  className?: string;
}) => React.JSX.Element;

interface ServicesListProps {
  services: Service[];
  onRefresh: () => void;
  onServiceCreated?: (service: Service) => void;
  onServiceUpdated?: (service: Service) => void;
  onServiceDeleted?: (serviceId: string) => void;
}

export function ServicesList({ services, onRefresh, onServiceCreated, onServiceUpdated, onServiceDeleted }: ServicesListProps) {
  const previousDeleteIsPending = useRef(false);
  const previousReorderIsPending = useRef(false);
  const { csrfToken } = useCSRF();
  const [localServices, setLocalServices] = useState<Service[]>(services);
  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Update local services when props change
  useEffect(() => {
    setLocalServices(services);
  }, [services]);

  const [deleteState, deleteAction, isDeletePending] = useActionState(deleteServiceAction, {
    success: false,
    error: '',
  });

  const [reorderState, reorderAction, isReorderPending] = useActionState<ReorderServicesState, FormData>(reorderServicesAction, {
    success: false,
    error: '',
  });

  // Handle delete action completion
  useEffect(() => {
    if (previousDeleteIsPending.current && !isDeletePending) {
      if (deleteState.success) {
        toast.success('Service supprimé avec succès !');
        onRefresh();
        // Update local state immediately for better UX
        setLocalServices(prev => prev.filter(service => service.id !== deleteServiceId));
        onServiceDeleted?.(deleteServiceId || '');
      } else if (deleteState.error) {
        toast.error(deleteState.error || 'Échec de la suppression du service');
      }
    }
    previousDeleteIsPending.current = isDeletePending;
  }, [isDeletePending, deleteState.success, deleteState.error, onRefresh, onServiceDeleted, deleteServiceId]);

  // Handle reorder action completion
  useEffect(() => {
    if (previousReorderIsPending.current && !isReorderPending) {
      if (reorderState.success) {
        toast.success('Ordre des services mis à jour avec succès !');
        if (reorderState.data) {
          setLocalServices(reorderState.data);
        }
        onRefresh();
      } else if (reorderState.error) {
        toast.error(reorderState.error || 'Échec de la mise à jour de l\'ordre');
        // Revert optimistic update on error
        setLocalServices(services);
      }
    }
    previousReorderIsPending.current = isReorderPending;
  }, [isReorderPending, reorderState.success, reorderState.error, reorderState.data, onRefresh, services]);

  const handleDelete = (id: string) => {
    if (!csrfToken) {
      toast.error('Jeton de sécurité non disponible. Veuillez actualiser la page.');
      return;
    }

    setDeleteServiceId(id);
    const formData = new FormData();
    formData.append('serviceId', id);
    formData.append('csrf_token', csrfToken);
    
    startTransition(() => {
      deleteAction(formData);
    });
  };

  const handleReorderServices = (reorderedServices: Service[]) => {
    // Optimistic update
    setLocalServices(reorderedServices);
    
    // Create form data with new order
    const formData = new FormData();
    reorderedServices.forEach((service, index) => {
      formData.append(`services[${index}][id]`, service.id);
      formData.append(`services[${index}][order]`, index.toString());
    });
    formData.append('csrf_token', csrfToken || '');

    startTransition(() => {
      reorderAction(formData);
    });
  };

  const sortedServices = localServices.sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Services</h2>
          <p className="text-muted-foreground">
            Gérez les services affichés dans le footer et sur la page de rendez-vous
          </p>
        </div>
        <div className="flex gap-2">
          <ServiceForm onSuccess={onRefresh} onServiceCreated={onServiceCreated} />
        </div>
      </div>

      {/* Services List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Services</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedServices.length > 0 ? (
            <SortableList
              items={sortedServices}
              onReorder={handleReorderServices}
              getId={(service) => service.id}
              renderItem={(service, index) => (
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Header with title and order */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {service.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          #{index + 1}
                        </span>
                        <Badge variant={service.isActive ? "default" : "secondary"}>
                          {service.isActive ? (
                            <>
                              <Eye className="h-3 w-3 mr-1" />
                              Actif
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3 mr-1" />
                              Inactif
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      {service.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {service.description}
                        </p>
                      )}
                      {service.icon && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {service.icon}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <ServiceForm 
                            service={service} 
                            onSuccess={onRefresh} 
                            onServiceUpdated={onServiceUpdated} 
                          />
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer le service</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer le service "{service.name}" ? 
                                Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(service.id)}
                                disabled={isPending}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {isPending ? 'Suppression...' : 'Supprimer'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Aucun service configuré. Ajoutez votre premier service pour commencer.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}