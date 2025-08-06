'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Trash2, RotateCcw, Eye, EyeOff, MoreHorizontal } from 'lucide-react';
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

interface TestimonialTableProps {
  testimonials: Testimonial[];
  onRefresh: () => void;
}

export default function TestimonialTable({ testimonials, onRefresh }: TestimonialTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!selectedTestimonial) return;

    setIsLoading(true);
    try {
      const result = await softDeleteTestimonialAction(selectedTestimonial.id);
      if (result.success) {
        toast.success(result.message);
        onRefresh();
      } else {
        toast.error(result.message);
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

    setIsLoading(true);
    try {
      const result = await restoreTestimonialAction(selectedTestimonial.id);
      if (result.success) {
        toast.success(result.message);
        onRefresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to restore testimonial');
    } finally {
      setIsLoading(false);
      setRestoreDialogOpen(false);
      setSelectedTestimonial(null);
    }
  };

  const handleToggleStatus = async (testimonial: Testimonial) => {
    setIsLoading(true);
    try {
      const result = await toggleTestimonialStatusAction(testimonial.id);
      if (result.success) {
        toast.success(result.message);
        onRefresh();
      } else {
        toast.error(result.message);
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

  const getMessageSnippet = (message: string, maxLength: number = 100) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  return (
    <>
             <div className="rounded-lg border bg-background shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold text-foreground">Name</TableHead>
              <TableHead className="font-semibold text-foreground">Message</TableHead>
              <TableHead className="font-semibold text-foreground">Title</TableHead>
              <TableHead className="font-semibold text-foreground">Status</TableHead>
              <TableHead className="font-semibold text-foreground">Created</TableHead>
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
                  {testimonial.title || '-'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={testimonial.isActive ? 'default' : 'secondary'}
                      className={testimonial.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-muted text-muted-foreground'}
                    >
                      {testimonial.isActive ? 'Published' : 'Hidden'}
                    </Badge>
                    {testimonial.isDeleted && (
                      <Badge variant="destructive" className="bg-destructive/10 text-destructive">
                        Deleted
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(testimonial.createdAt), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => handleToggleStatus(testimonial)}
                        disabled={isLoading}
                        className="cursor-pointer"
                      >
                        {testimonial.isActive ? (
                          <>
                            <EyeOff className="mr-2 h-4 w-4" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="mr-2 h-4 w-4" />
                            Show
                          </>
                        )}
                      </DropdownMenuItem>
                      
                      {!testimonial.isDeleted && (
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(testimonial)}
                          disabled={isLoading}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      )}
                      
                      {testimonial.isDeleted && (
                        <DropdownMenuItem
                          onClick={() => openRestoreDialog(testimonial)}
                          disabled={isLoading}
                          className="cursor-pointer text-emerald-600 focus:text-emerald-600"
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Restore
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
            <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedTestimonial?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                         <AlertDialogAction
               onClick={handleDelete}
               disabled={isLoading}
               className="bg-destructive hover:bg-destructive/90"
             >
               {isLoading ? 'Deleting...' : 'Delete'}
             </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Testimonial</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore "{selectedTestimonial?.name}"? This will make it available again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                         <AlertDialogAction
               onClick={handleRestore}
               disabled={isLoading}
               className="bg-emerald-600 hover:bg-emerald-700"
             >
               {isLoading ? 'Restoring...' : 'Restore'}
             </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 