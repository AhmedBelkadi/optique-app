'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { AboutBenefit } from '@/features/about/shema/aboutBenefitSchema';
import { reorderAboutBenefitsAction } from '@/features/about/actions/reorderAboutBenefits';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AboutBenefitForm from './AboutBenefitForm';
import DeleteAboutBenefitModal from './DeleteAboutBenefitModal';
import SortableList from './SortableList';
import { useCSRF } from '@/components/common/CSRFProvider';

interface AboutBenefitsManagerProps {
  benefits: AboutBenefit[];
}

export default function AboutBenefitsManager({ benefits }: AboutBenefitsManagerProps) {
  const { csrfToken } = useCSRF();
  const [benefitsList, setBenefitsList] = useState<AboutBenefit[]>(benefits || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<AboutBenefit | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [benefitToDelete, setBenefitToDelete] = useState<AboutBenefit | null>(null);

  const handleAddBenefit = () => {
    setEditingBenefit(null);
    setIsDialogOpen(true);
  };

  const handleEditBenefit = (benefit: AboutBenefit) => {
    setEditingBenefit(benefit);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (benefit: AboutBenefit) => {
    setBenefitToDelete(benefit);
    setDeleteModalOpen(true);
  };

  const handleReorderBenefits = async (reorderedBenefits: AboutBenefit[]) => {
    // Optimistic update
    setBenefitsList(reorderedBenefits);
    
    try {
      const orderedIds = reorderedBenefits.map(benefit => benefit.id);
      
      // Create FormData with CSRF token
      const formData = new FormData();
      orderedIds.forEach(id => formData.append('orderedIds', id));
      formData.append('csrf_token', csrfToken || '');
      
      const result = await reorderAboutBenefitsAction({}, formData);
      
      if (result.success) {
        toast.success('Avantages reordonnés avec succès !');
        if (result.data) {
          setBenefitsList(result.data);
        }
      } else {
        toast.error(result.error || 'Échec du reordonnement des avantages');
        // Revert the optimistic update
        setBenefitsList(benefits);
      }
    } catch (error) {
      console.error('Error reordering benefits:', error);
      toast.error('Échec du reordonnement des avantages');
      // Revert the optimistic update
      setBenefitsList(benefits);
    }
  };

  const handleDeleteSuccess = (updatedBenefits: AboutBenefit[]) => {
    setBenefitsList(updatedBenefits);
    setDeleteModalOpen(false);
    setBenefitToDelete(null);
  };

  const handleFormSuccess = (updatedBenefits: AboutBenefit[]) => {
    setBenefitsList(updatedBenefits);
    setIsDialogOpen(false);
    setEditingBenefit(null);
  };

    const renderBenefitItem = (benefit: AboutBenefit, index: number) => (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-3">
        <div className="flex items-center text-muted-foreground">
          <span className="ml-2 text-sm font-medium">#{index + 1}</span>
        </div>
        <div className={`w-8 h-8 ${benefit.bgColor} rounded-lg flex items-center justify-center`}>
          <span className={`text-xs font-bold ${benefit.color.replace('text-', '')}`}>
            {benefit.icon.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-semibold">{benefit.title}</h3>
          <p className="text-sm text-muted-foreground">{benefit.description}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEditBenefit(benefit)}
          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDeleteClick(benefit)}
          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Avantages</h3>
        <Button onClick={handleAddBenefit} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un avantage
        </Button>
      </div>

      {(!benefitsList || benefitsList.length === 0) ? (
        <div className="text-center py-8 text-muted-foreground">
            <p>Aucun avantage ajouté.</p>
          <p className="text-sm">Cliquez sur "Ajouter un avantage" pour commencer.</p>
        </div>
      ) : (
        <SortableList
          items={benefitsList}
          onReorder={handleReorderBenefits}
          renderItem={renderBenefitItem}
          getId={(benefit) => benefit.id}
        />
      )}

      {/* Add/Edit Benefit Form */}
      <AboutBenefitForm
        benefit={editingBenefit}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingBenefit(null);
        }}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteAboutBenefitModal
        benefit={benefitToDelete}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
