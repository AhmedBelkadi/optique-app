'use client';

import { useState } from 'react';
import { Testimonial } from '@/features/testimonials/schema/testimonialSchema';
import { restoreTestimonialAction } from '@/features/testimonials/actions/restoreTestimonial';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, EyeOff } from 'lucide-react';
import { format } from 'date-fns';
import { useCSRF } from '@/components/common/CSRFProvider';

interface DeletedTestimonialsContainerProps {
  initialDeletedTestimonials: Testimonial[];
}

export default function DeletedTestimonialsContainer({ 
  initialDeletedTestimonials 
}: DeletedTestimonialsContainerProps) {
  const { csrfToken, isLoading: csrfLoading, error: csrfError } = useCSRF();
  const [deletedTestimonials, setDeletedTestimonials] = useState<Testimonial[]>(initialDeletedTestimonials);
  const [restoring, setRestoring] = useState<string | null>(null);

  const handleRestore = async (testimonialId: string) => {
    if (csrfLoading || csrfError) {
      toast.error('CSRF token not available');
      return;
    }

    setRestoring(testimonialId);
    try {
      // Create FormData for the action
      const formData = new FormData();
      formData.append('testimonialId', testimonialId);
      
      // Add CSRF token
      if (csrfToken) {
        formData.append('csrf_token', csrfToken);
      }
      
      const result = await restoreTestimonialAction(null, formData);
      
      if (result.success) {
        setDeletedTestimonials(prev => prev.filter(t => t.id !== testimonialId));
        toast.success('Testimonial restored successfully!', {
          icon: '✅',
          style: {
            background: '#10b981',
            color: '#ffffff',
          },
        });
      } else {
        toast.error(result.error || 'Failed to restore testimonial');
      }
    } catch (error) {
      console.error('Error restoring testimonial:', error);
      toast.error('Failed to restore testimonial');
    } finally {
      setRestoring(null);
    }
  };

  if (deletedTestimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground/60 text-6xl mb-4">🗑️</div>
        <h3 className="text-lg font-medium text-foreground mb-2">No deleted testimonials</h3>
        <p className="text-muted-foreground">Deleted testimonials will appear here and can be restored.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Deleted Testimonials ({deletedTestimonials.length})</h2>
      </div>

      <div className="grid gap-4">
        {deletedTestimonials.map((testimonial) => (
          <Card key={testimonial.id} className="border-destructive/20 bg-destructive/5">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    {testimonial.name}
                    {testimonial.title && (
                      <span className="text-sm font-normal text-muted-foreground">
                        - {testimonial.title}
                      </span>
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      <span className="flex items-center gap-1">
                        <EyeOff className="w-3 h-3" />
                        Deleted
                      </span>
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Deleted on {testimonial.deletedAt ? format(new Date(testimonial.deletedAt), 'MMM dd, yyyy') : 'Unknown date'}
                    </span>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRestore(testimonial.id)}
                  disabled={restoring === testimonial.id || csrfLoading}
                  className="border-destructive/30 text-white hover:bg-destructive/80"
                >
                  {restoring === testimonial.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                  ) : (
                    <RotateCcw className="w-4 h-4 mr-2" />
                  )}
                  Restore
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {testimonial.message}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
