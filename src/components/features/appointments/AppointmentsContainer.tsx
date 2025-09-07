'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, Calendar, Clock, User, Phone, Mail, Eye, Edit, Trash2, CheckCircle, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';
import { deleteAppointmentAction } from '@/features/appointments/actions/deleteAppointmentAction';
import { getAllAppointmentsAction } from '@/features/appointments/actions/getAllAppointmentsAction';
import { useCSRF } from '@/components/common/CSRFProvider';
import Link from 'next/link';
import { FormattedDate, FormattedTime } from '@/components/common/FormattedDate';

interface Appointment {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  notes?: string;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  status: {
    id: string;
    name: string;
    displayName: string;
    color: string;
  };
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

interface AppointmentsContainerProps {
  initialAppointments: Appointment[];
  pagination?: Pagination;
  currentPage: number;
}

const appointmentStatuses = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'scheduled', label: 'Programmé' },
  { value: 'confirmed', label: 'Confirmé' },
  { value: 'in-progress', label: 'En Cours' },
  { value: 'completed', label: 'Terminé' },
  { value: 'cancelled', label: 'Annulé' },
  { value: 'no-show', label: 'Absent' },
];

const sortOptions = [
  { value: 'createdAt-desc', label: 'Plus récents' },
  { value: 'createdAt-asc', label: 'Plus anciens' },
  { value: 'startTime-asc', label: 'Date croissante' },
  { value: 'startTime-desc', label: 'Date décroissante' },
  { value: 'title-asc', label: 'Titre A-Z' },
  { value: 'title-desc', label: 'Titre Z-A' },
];

export default function AppointmentsContainer({ 
  initialAppointments, 
  pagination,
  currentPage 
}: AppointmentsContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { csrfToken } = useCSRF();
  const [appointments, setAppointments] = useState(initialAppointments);
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [sortValue, setSortValue] = useState(
    `${searchParams.get('sortBy') || 'createdAt'}-${searchParams.get('sortOrder') || 'desc'}`
  );
  const [deleting, setDeleting] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Update URL when filters change
  const updateFilters = (updates: { [key: string]: string }) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 when filters change
    params.set('page', '1');
    
    router.push(`/admin/appointments?${params.toString()}`);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const filters = {
        search: searchValue || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
        sortBy: (sortValue.split('-')[0] as 'title' | 'startTime' | 'createdAt' | 'updatedAt') || 'createdAt',
        sortOrder: (sortValue.split('-')[1] as 'asc' | 'desc') || 'desc',
        page: 1,
        limit: 12
      };

      const result = await getAllAppointmentsAction(filters);
      if (result.success && result.data) {
        setAppointments(result.data);
        // Update URL with current filter values
        updateFilters({ 
          search: searchValue,
          status: statusFilter === 'all' ? '' : statusFilter,
          sortBy: sortValue.split('-')[0],
          sortOrder: sortValue.split('-')[1]
        });
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Erreur lors de la recherche');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchValue('');
    setStatusFilter('all');
    setSortValue('createdAt-desc');
    setAppointments(initialAppointments);
    // Clear URL parameters
    router.push('/admin/appointments');
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  const handleSort = (sort: string) => {
    setSortValue(sort);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDelete = async (appointmentId: string) => {
    if (!csrfToken) {
      toast.error('Jeton de sécurité non disponible. Veuillez actualiser la page.');
      return;
    }

    setDeleting(appointmentId);
    try {
      const formData = new FormData();
      formData.append('appointmentId', appointmentId);
      formData.append('permanent', 'false');
      formData.append('csrf_token', csrfToken);

      const result = await deleteAppointmentAction({}, formData);
      
      if (result.success) {
        setAppointments(prev => prev.filter(a => a.id !== appointmentId));
        toast.success('Rendez-vous supprimé avec succès');
      } else {
        toast.error(result.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeleting(null);
    }
  };

  const getStatusBadgeVariant = (statusName: string) => {
    switch (statusName) {
      case 'scheduled': return 'default';
      case 'confirmed': return 'secondary';
      case 'in-progress': return 'outline';
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      case 'no-show': return 'secondary';
      default: return 'default';
    }
  };


  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Main Filter Row */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
              {/* Search */}
              <div className="flex-1 min-w-0">
                <label className="text-sm font-medium mb-2 block">Rechercher</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Nom, email, téléphone..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10 h-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="w-full lg:w-48">
                <label className="text-sm font-medium mb-2 block">Statut</label>
                <Select value={statusFilter} onValueChange={handleStatusFilter}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div className="w-full lg:w-48">
                <label className="text-sm font-medium mb-2 block">Trier par</label>
                <Select value={sortValue} onValueChange={handleSort}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 w-full lg:w-auto">
                <Button 
                  onClick={handleSearch} 
                  disabled={isLoading}
                  className="flex-1 lg:flex-none h-10"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Rechercher
                </Button>
                <Button 
                  variant="default" 
                  onClick={handleClearFilters}
                  className="h-10 px-3"
                  title="Effacer tous les filtres"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Active Filters Indicator */}
            {(searchValue || statusFilter !== 'all' || sortValue !== 'startTime-asc') && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Filtres actifs:</span>
                {searchValue && (
                  <Badge variant="secondary" className="text-xs">
                    Recherche: "{searchValue}"
                  </Badge>
                )}
                {statusFilter !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    Statut: {appointmentStatuses.find(s => s.value === statusFilter)?.label}
                  </Badge>
                )}
                {sortValue !== 'startTime-asc' && (
                  <Badge variant="secondary" className="text-xs">
                    Tri: {sortOptions.find(s => s.value === sortValue)?.label}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      {pagination && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Affichage de {((pagination.page - 1) * pagination.limit) + 1} à{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} sur {pagination.total} rendez-vous
          </span>
          <span>Page {pagination.page} sur {pagination.totalPages}</span>
        </div>
      )}

      {/* Appointments List */}
      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Chargement des rendez-vous...</p>
            </CardContent>
          </Card>
        ) : appointments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun rendez-vous trouvé</h3>
              <p className="text-muted-foreground mb-4">
                Aucun rendez-vous ne correspond à vos critères de recherche.
              </p>
              <Button asChild>
                <Link href="/admin/appointments/new">
                  <Calendar className="h-4 w-4 mr-2" />
                  Créer un nouveau rendez-vous
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header with title and status */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground truncate">
                          {appointment.title}
                        </h3>
                        {appointment.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {appointment.description}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={getStatusBadgeVariant(appointment.status.name)}
                        style={{ backgroundColor: appointment.status.color + '20', color: appointment.status.color }}
                        className="ml-2 flex-shrink-0"
                      >
                        {appointment.status.displayName}
                      </Badge>
                    </div>

                    {/* Date and Time */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span><FormattedDate date={appointment.startTime} /></span>

                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span>
                        <span>
                           <FormattedTime date={appointment.startTime} /> - <FormattedTime date={appointment.endTime} />
                        </span>
                        </span>
                      </div>
                    </div>

                    {/* Customer info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium truncate">{appointment.customer.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{appointment.customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{appointment.customer.email}</span>
                      </div>
                    </div>

                    {/* Notes */}
                    {appointment.notes && (
                      <div className="text-sm">
                        <span className="font-medium text-muted-foreground">Notes: </span>
                        <span className="text-foreground line-clamp-2">{appointment.notes}</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2 border-t border-border/50">
                      <Link href={`/admin/appointments/${appointment.id}`} className="flex-1">
                        <Button size="sm" className="w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir
                        </Button>
                      </Link>
                      <Link href={`/admin/appointments/${appointment.id}/edit`} className="flex-1">
                        <Button variant="success" size="sm" className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                      </Link>
                      <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          disabled={deleting === appointment.id}
                        >
                          {deleting === appointment.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </>
                          )}
                        </Button>
                      </DialogTrigger>

                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirmer la suppression</DialogTitle>
                            <DialogDescription>
                              Êtes-vous sûr de vouloir supprimer ce rendez-vous ? Cette action le déplacera vers la corbeille.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-end gap-3">
                            <Button className="bg-gray-300 text-black font-medium py-2 px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200" onClick={() => document.querySelector('[role="dialog"]')?.remove()}>
                              Annuler
                            </Button>
                            <Button 
                              variant="destructive" 
                              onClick={() => handleDelete(appointment.id)}
                              disabled={deleting === appointment.id}
                            >
                              {deleting === appointment.id ? 'Suppression...' : 'Supprimer'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          {pagination.hasPrev && (
            <Button
              variant="default"
              onClick={() => updateFilters({ page: (currentPage - 1).toString() })}
            >
              Précédent
            </Button>
          )}
          
          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === currentPage;
            
            return (
              <Button
                key={pageNum}
                variant={isActive ? "default" : "outline"}
                onClick={() => updateFilters({ page: pageNum.toString() })}
              >
                {pageNum}
              </Button>
            );
          })}
          
          {pagination.hasNext && (
            <Button
              variant="default"
              onClick={() => updateFilters({ page: (currentPage + 1).toString() })}
            >
              Suivant
            </Button>
          )}
        </div>
      )}
    </div>
  );
} 