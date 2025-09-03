'use client';

import { useEffect, useRef } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';
import { AboutSection } from '@/features/about/shema/aboutSectionSchema';
import { deleteAboutSectionAction } from '@/features/about/actions/deleteAboutSection';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCSRF } from '@/components/common/CSRFProvider';

interface DeleteAboutSectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: AboutSection | null;
  onSuccess?: (updatedSections: AboutSection[]) => void;
}

export default function DeleteAboutSectionModal({
  open,
  onOpenChange,
  section,
  onSuccess,
}: DeleteAboutSectionModalProps) {
  const previousIsPending = useRef(false);
  const { csrfToken } = useCSRF();

  const [state, formAction, isPending] = useActionState(deleteAboutSectionAction, {
    success: false,
    error: '',
  });

  useEffect(() => {
    if (previousIsPending.current && !isPending) {
      if (state.success) {
        toast.success('About section deleted successfully!', {
          icon: '✅',
          style: {
            background: '#10b981',
            color: '#ffffff',
          },
        });
        if (state.data) {
          onSuccess?.(state.data);
        }
        onOpenChange(false);
      } else if (state.error) {
        toast.error(state.error || 'Failed to delete about section', {
          icon: '❌',
          style: {
            background: '#ef4444',
            color: '#ffffff',
          },
        });
      }
    }
    previousIsPending.current = isPending;
  }, [isPending, state.success, state.error, state.data, onSuccess, onOpenChange]);

  const handleSubmit = (formData: FormData) => {
    if (section) {
      formData.append('sectionId', section.id);
    }
    // Add CSRF token to form data
    if (csrfToken) {
      formData.append('csrf_token', csrfToken);
    }
    formAction(formData);
  };

  if (!section) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-foreground">
                Delete About Section
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
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-orange-800">
                    Are you sure you want to delete "{section.title}"?
                  </p>
                  <p className="text-sm text-orange-700">
                    This will permanently remove the about section from your system. 
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {state.error && (
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-4">
                <div className="flex items-center text-destructive">
                  <X className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{state.error}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <form action={handleSubmit}>
          <input type="hidden" name="sectionId" value={section.id} />

          <DialogFooter className="pt-4">
            <div className="flex space-x-3 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                className="flex-1 bg-background/50 backdrop-blur-sm border-border hover:bg-muted/50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isPending}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Section
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
