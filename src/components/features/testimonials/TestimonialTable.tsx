'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Trash2, RotateCcw, Eye, EyeOff, MoreHorizontal, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { Testimonial } from '@/features/testimonials/schema/testimonialSchema';
import { softDeleteTestimonialAction } from '@/features/testimonials/actions/softDeleteTestimonial';
import { restoreTestimonialAction } from '@/features/testimonials/actions/restoreTestimonial';
import { toggleTestimonialStatusAction } from '@/features/testimonials/actions/toggleTestimonialStatus';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { useCSRF } from '@/components/common/CSRFProvider';

interface TestimonialTableProps {
  testimonials: Testimonial[];
  onDelete?: (testimonialId: string) => void;
  onUpdate?: (updatedTestimonial: Testimonial) => void;
}

export default function TestimonialTable({ testimonials, onDelete, onUpdate }: TestimonialTableProps) {
  const router = useRouter();
  const { csrfToken, isLoading: csrfLoading, error: csrfError } = useCSRF();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!selectedTestimonial) return;

    if (csrfLoading || csrfError) {
      toast.error('CSRF token not available');
      return;
    }

    setIsLoading(true);
    try {
      // Create FormData for the action
      const formData = new FormData();
      formData.append('testimonialId', selectedTestimonial.id);
      
      // Add CSRF token
      if (csrfToken) {
        formData.append('csrf_token', csrfToken);
      }
      
      const result = await softDeleteTestimonialAction(null, formData);
      if (result.success) {
        toast.success(result.message);
        onDelete?.(selectedTestimonial.id);
      } else {
        toast.error(result.error || 'Failed to delete testimonial');
      }
    } catch (error) {
      toast.error('Failed to delete testimonial');
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
      setSelectedTestimonial(null);
    }
  };

  const handleRestore = async () => {
    if (!selectedTestimonial) return;

    if (csrfLoading || csrfError) {
      toast.error('CSRF token not available');
      return;
    }

    setIsLoading(true);
    try {
      // Create FormData for the action
      const formData = new FormData();
      formData.append('testimonialId', selectedTestimonial.id);
      
      // Add CSRF token
      if (csrfToken) {
        formData.append('csrf_token', csrfToken);
      }
      
      const result = await restoreTestimonialAction(null, formData);
      if (result.success) {
        toast.success(result.message);
        onUpdate?.(selectedTestimonial);
      } else {
        toast.error(result.error || 'Failed to restore testimonial');
      }
    } catch (error) {
      toast.error('Failed to restore testimonial');
    } finally {
      setIsLoading(false);
      setRestoreDialogOpen(false);
      setSelectedTestimonial(null);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    // Navigate to edit page
    router.push(`/admin/testimonials/${testimonial.id}/edit`);
  };

  const handleToggleStatus = async (testimonial: Testimonial) => {
    if (csrfLoading || csrfError) {
      toast.error('CSRF token not available');
      return;
    }

    setIsLoading(true);
    try {
      // Create FormData for the action
      const formData = new FormData();
      formData.append('testimonialId', testimonial.id);
      formData.append('newStatus', (!testimonial.isActive).toString());
      
      // Add CSRF token
      if (csrfToken) {
        formData.append('csrf_token', csrfToken);
      }
      
      const result = await toggleTestimonialStatusAction(null, formData);
      if (result.success) {
        toast.success(result.message);
        // Update the testimonial with the new status
        const updatedTestimonial = { ...testimonial, isActive: !testimonial.isActive };
        onUpdate?.(updatedTestimonial);
      } else {
        toast.error(result.error || 'Failed to toggle testimonial status');
      }
    } catch (error) {
      toast.error('Failed to toggle testimonial status');
    } finally {
      setIsLoading(false);
    }
  };


  const openDeleteDialog = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setDeleteDialogOpen(true);
  };

  const openRestoreDialog = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setRestoreDialogOpen(true);
  };

  const getMessageSnippet = (message: string) => {
    return message.length > 100 ? `${message.substring(0, 100)}...` : message;
  };

  const getRatingDisplay = (rating: number) => {
    return '⭐'.repeat(rating);
  };

  const getSourceDisplay = (source: string) => {
    const sourceMap: Record<string, string> = {
      internal: 'Interne',
      facebook: 'Facebook',
      google: 'Google',
      trustpilot: 'Trustpilot'
    };
    return sourceMap[source] || source;
  };

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun témoignage trouvé</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-foreground">Client</TableHead>
              <TableHead className="font-semibold text-foreground">Message</TableHead>
              <TableHead className="font-semibold text-foreground">Note</TableHead>
              <TableHead className="font-semibold text-foreground">Source</TableHead>
              <TableHead className="font-semibold text-foreground">Titre</TableHead>
              <TableHead className="font-semibold text-foreground">Statut</TableHead>
              <TableHead className="font-semibold text-foreground">Date</TableHead>
              <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((testimonial) => (
              <TableRow key={testimonial.id} className="hover:bg-muted/50">
                <TableCell className="font-medium text-foreground">
                  {testimonial.name}
                </TableCell>
                <TableCell className="text-muted-foreground max-w-xs">
                  <div className="truncate">
                    {getMessageSnippet(testimonial.message)}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span className="text-sm">{testimonial.rating}</span>
                    <span className="text-yellow-400">{getRatingDisplay(testimonial.rating)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <Badge variant="default" className="text-xs">
                    {getSourceDisplay(testimonial.source)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {testimonial.title || '-'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={testimonial.isActive ? 'default' : 'secondary'}
                      className={testimonial.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-muted text-muted-foreground'}
                    >
                      {testimonial.isActive ? 'Publié' : 'Masqué'}
                    </Badge>
                    {testimonial.isVerified && (
                      <Badge variant="default" className="bg-blue-100 text-blue-800 text-xs">
                        Vérifié
                      </Badge>
                    )}
                    {testimonial.isDeleted && (
                      <Badge variant="destructive" className="bg-destructive/10 text-destructive">
                        Supprimé
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(testimonial.createdAt), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                                            {!testimonial.isDeleted && (
                        <DropdownMenuItem
                          onClick={() => handleEdit(testimonial)}
                          disabled={isLoading || csrfLoading}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuItem
                        onClick={() => handleToggleStatus(testimonial)}
                        disabled={isLoading || csrfLoading}
                        className="cursor-pointer"
                      >
                        {testimonial.isActive ? (
                          <>
                            <EyeOff className="mr-2 h-4 w-4" />
                            Masquer
                          </>
                        ) : (
                          <>
                            <Eye className="mr-2 h-4 w-4" />
                            Afficher
                          </>
                        )}
                      </DropdownMenuItem>
                      
                      {!testimonial.isDeleted && (
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(testimonial)}
                          disabled={isLoading || csrfLoading}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      )}
                      
                      {testimonial.isDeleted && (
                        <DropdownMenuItem
                          onClick={() => openRestoreDialog(testimonial)}
                          disabled={isLoading || csrfLoading}
                          className="cursor-pointer text-emerald-600 focus:text-emerald-600"
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Restaurer
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le témoignage</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer "{selectedTestimonial?.name}" ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
                            className="bg-gray-300 text-black font-medium py-2 px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200"
            disabled={isLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isLoading ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restaurer le témoignage</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir restaurer "{selectedTestimonial?.name}" ? Il sera à nouveau disponible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
                            className="bg-gray-300 text-black font-medium py-2 px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200"

            disabled={isLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestore}
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isLoading ? 'Restauration...' : 'Restaurer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 