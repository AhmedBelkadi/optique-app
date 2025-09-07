'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AboutBenefit } from '@/features/about/shema/aboutBenefitSchema';
import { deleteAboutBenefitAction } from '@/features/about/actions/deleteAboutBenefit';
import { toast } from 'react-hot-toast';
import { useCSRF } from '@/components/common/CSRFProvider';

interface DeleteAboutBenefitModalProps {
  benefit: AboutBenefit | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (benefits: AboutBenefit[]) => void;
}

export default function DeleteAboutBenefitModal({ benefit, isOpen, onClose, onSuccess }: DeleteAboutBenefitModalProps) {
  const { csrfToken, isLoading: csrfLoading, error: csrfError } = useCSRF();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!benefit) return;

    if (csrfLoading) {
      toast.error('Le jeton de sécurité est encore en cours de chargement. Veuillez patienter.');
      return;
    }

    if (csrfError || !csrfToken) {
      toast.error('Erreur du jeton de sécurité. Veuillez actualiser la page.');
      return;
    }

    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.append('aboutBenefitId', benefit.id);
      formData.append('csrf_token', csrfToken);

      const result = await deleteAboutBenefitAction({}, formData);

      if (result.success) {
        toast.success('Benefit deleted successfully');
        if (result.data) {
          onSuccess?.(result.data);
        }
        onClose();
      } else {
        toast.error(result.error || 'Failed to delete benefit');
      }
    } catch (error) {
      console.error('Error deleting benefit:', error);
      toast.error('Failed to delete benefit');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  if (!benefit) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Benefit</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the benefit "{benefit.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            className="bg-gray-300 text-black font-medium py-2 px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200"

            onClick={handleClose}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || csrfLoading}
          >
            {isDeleting ? 'Deleting...' : 'Delete Benefit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
