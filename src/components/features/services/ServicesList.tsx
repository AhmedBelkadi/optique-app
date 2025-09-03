'use client';

import { useState, useRef, useEffect } from 'react';
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
  GripVertical,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { ServiceForm } from './ServiceForm';
import { deleteServiceAction, DeleteServiceState } from '@/features/services/actions/deleteServiceAction';
import { reorderServicesAction } from '@/features/services/actions/reorderServicesAction';
import { useCSRF } from '@/components/common/CSRFProvider';
import { toast } from 'react-hot-toast';

interface ServicesListProps {
  services: Service[];
  onRefresh: () => void;
  onServiceCreated?: (service: Service) => void;
  onServiceUpdated?: (service: Service) => void;
  onServiceDeleted?: (serviceId: string) => void;
}

export function ServicesList({ services, onRefresh, onServiceCreated, onServiceUpdated, onServiceDeleted }: ServicesListProps) {
  const previousIsPending = useRef(false);
  const { csrfToken } = useCSRF();
  const [reorderMode, setReorderMode] = useState(false);
  const [reorderedServices, setReorderedServices] = useState<Service[]>(services);
  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null);
  const [reorderPending, setReorderPending] = useState(false);

  const [deleteState, deleteAction, isDeletePending] = useActionState(
    (prevState: DeleteServiceState, formData: FormData) => deleteServiceAction(deleteServiceId!, prevState, formData),
    {
      success: false,
      error: '',
    }
  );

  // Handle delete action completion
  useEffect(() => {
    if (previousIsPending.current && !isDeletePending) {
      if (deleteState.success) {
        toast.success('Service supprimé avec succès !');
        onServiceDeleted?.(deleteServiceId!);
        onRefresh();
        setDeleteServiceId(null);
      } else if (deleteState.error) {
        toast.error(deleteState.error || 'Échec de la suppression du service');
      }
    }
    previousIsPending.current = isDeletePending;
  }, [isDeletePending, deleteState.success, deleteState.error, onServiceDeleted, onRefresh, deleteServiceId]);

  const handleDelete = (id: string) => {
    if (!csrfToken) {
      toast.error('Jeton de sécurité non disponible. Veuillez actualiser la page.');
      return;
    }

    setDeleteServiceId(id);
    const formData = new FormData();
    formData.append('csrf_token', csrfToken);
    deleteAction(formData);
  };

  const handleReorder = () => {
    if (!csrfToken) {
      toast.error('Jeton de sécurité non disponible. Veuillez actualiser la page.');
      return;
    }

    setReorderPending(true);
    const reorderData = reorderedServices.map((service, index) => ({
      id: service.id,
      order: index,
    }));
    
    const formData = new FormData();
    formData.append('services', JSON.stringify(reorderData));
    formData.append('csrf_token', csrfToken);
    
    reorderServicesAction(reorderData, {}).then((result) => {
      setReorderPending(false);
      if (result.success) {
        toast.success('Ordre des services mis à jour avec succès !');
        setReorderMode(false);
        onRefresh();
      } else {
        toast.error(result.error || 'Échec de la mise à jour de l\'ordre');
      }
    }).catch(() => {
      setReorderPending(false);
      toast.error('Erreur lors de la mise à jour de l\'ordre');
    });
  };

  const moveService = (index: number, direction: 'up' | 'down') => {
    const newServices = [...reorderedServices];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newServices.length) {
      [newServices[index], newServices[newIndex]] = [newServices[newIndex], newServices[index]];
      setReorderedServices(newServices);
    }
  };

  const sortedServices = reorderMode ? reorderedServices : services.sort((a, b) => a.order - b.order);

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
          {!reorderMode ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setReorderedServices([...services.sort((a, b) => a.order - b.order)]);
                  setReorderMode(true);
                }}
              >
                <GripVertical className="h-4 w-4 mr-2" />
                Réorganiser
              </Button>
              <ServiceForm onSuccess={onRefresh} onServiceCreated={onServiceCreated} />
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setReorderMode(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={handleReorder}
                disabled={reorderPending}
              >
                {reorderPending ? 'Sauvegarde...' : 'Sauvegarder l\'ordre'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {reorderMode ? 'Réorganiser les Services' : 'Liste des Services'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {reorderMode && <TableHead className="w-12">Ordre</TableHead>}
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Icône</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Ordre</TableHead>
                {!reorderMode && <TableHead className="w-12">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedServices.map((service, index) => (
                <TableRow key={service.id}>
                  {reorderMode && (
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveService(index, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveService(index, 'down')}
                          disabled={index === sortedServices.length - 1}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>
                    {service.description ? (
                      <span className="text-sm text-muted-foreground">
                        {service.description.length > 50 
                          ? `${service.description.substring(0, 50)}...` 
                          : service.description
                        }
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground italic">Aucune description</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {service.icon ? (
                      <Badge variant="outline">{service.icon}</Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground italic">Aucune icône</span>
                    )}
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{service.order}</Badge>
                  </TableCell>
                  {!reorderMode && (
                    <TableCell>
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
                                  disabled={isDeletePending}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  {isDeletePending ? 'Suppression...' : 'Supprimer'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {services.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Aucun service configuré. Ajoutez votre premier service pour commencer.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}