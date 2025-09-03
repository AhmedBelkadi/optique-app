'use client';

import { useState, useTransition } from 'react';
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
import { deleteServiceAction } from '@/features/services/actions/deleteServiceAction';
import { reorderServicesAction } from '@/features/services/actions/reorderServicesAction';

interface ServicesListProps {
  services: Service[];
  onRefresh: () => void;
}

export function ServicesList({ services, onRefresh }: ServicesListProps) {
  const [isPending, startTransition] = useTransition();
  const [reorderMode, setReorderMode] = useState(false);
  const [reorderedServices, setReorderedServices] = useState<Service[]>(services);

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteServiceAction(id, {});
      if (result.success) {
        onRefresh();
      }
    });
  };

  const handleReorder = () => {
    startTransition(async () => {
      const reorderData = reorderedServices.map((service, index) => ({
        id: service.id,
        order: index,
      }));
      
      const result = await reorderServicesAction(reorderData, {});
      if (result.success) {
        setReorderMode(false);
        onRefresh();
      }
    });
  };

  const moveService = (index: number, direction: 'up' | 'down') => {
    const newServices = [...reorderedServices];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newServices.length) {
      [newServices[index], newServices[targetIndex]] = [newServices[targetIndex], newServices[index]];
      setReorderedServices(newServices);
    }
  };

  const getIconComponent = (iconName?: string) => {
    // This is a simplified version - in a real app you'd import the actual icons
    return iconName || 'Circle';
  };

  if (reorderMode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Réorganiser les Services</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setReorderMode(false);
                  setReorderedServices(services);
                }}
              >
                Annuler
              </Button>
              <Button
                size="sm"
                onClick={handleReorder}
                disabled={isPending}
              >
                {isPending ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {reorderedServices.map((service, index) => (
              <div
                key={service.id}
                className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="font-medium">{service.name}</div>
                  {service.description && (
                    <div className="text-sm text-muted-foreground">
                      {service.description}
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveService(index, 'up')}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveService(index, 'down')}
                    disabled={index === reorderedServices.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Services ({services.length})</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setReorderMode(true);
                setReorderedServices(services);
              }}
            >
              Réorganiser
            </Button>
            <ServiceForm onSuccess={onRefresh} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {services.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Aucun service configuré</p>
            <p className="text-sm">Ajoutez votre premier service pour commencer</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ordre</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Icône</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-mono text-sm">
                    {service.order}
                  </TableCell>
                  <TableCell className="font-medium">
                    {service.name}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {service.description || '-'}
                  </TableCell>
                  <TableCell>
                    {service.icon ? (
                      <Badge variant="outline" className="text-xs">
                        {service.icon}
                      </Badge>
                    ) : (
                      '-'
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <ServiceForm service={service} onSuccess={onRefresh} />
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer le service</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer le service "{service.name}" ?
                                Cette action ne peut pas être annulée.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(service.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                disabled={isPending}
                              >
                                {isPending ? 'Suppression...' : 'Supprimer'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
