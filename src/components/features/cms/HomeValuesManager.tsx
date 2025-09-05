"use client"

import { useState, useEffect, useRef } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye, Star } from 'lucide-react';
import { HomeValues } from '@/features/home/schema/homeValuesSchema';
import { deleteHomeValueAction, DeleteHomeValueState } from '@/features/home/actions/deleteHomeValue';
import { reorderHomeValuesAction } from '@/features/home/actions/reorderHomeValues';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HomeValuesDialog from './HomeValuesDialog';
import DeleteHomeValueModal from './DeleteHomeValueModal';
import SortableList from './SortableList';
import { useCSRF } from '@/components/common/CSRFProvider';

interface HomeValuesManagerProps {
  values: HomeValues[]
}

export function HomeValuesManager({ values }: HomeValuesManagerProps) {
  const { csrfToken } = useCSRF();
  const [homeValues, setHomeValues] = useState<HomeValues[]>(values);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingValue, setEditingValue] = useState<HomeValues | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [valueToDelete, setValueToDelete] = useState<HomeValues | null>(null);
  const [isClient, setIsClient] = useState(false);
  const previousDeleteIsPending = useRef(false);

  // Fix hydration mismatch by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Delete home value action state
  const [deleteState, deleteFormAction, isDeletePending] = useActionState<DeleteHomeValueState, FormData>(
    deleteHomeValueAction,
    {
      success: false,
      error: '',
      data: [],
    }
  );


  // Handle delete success/error
  useEffect(() => {
    if (previousDeleteIsPending.current && !isDeletePending) {
      if (deleteState.success) {
        toast.success('Valeur supprimée avec succès !');
        if (deleteState.data) {
          setHomeValues(deleteState.data);
        }
        setDeleteModalOpen(false);
        setValueToDelete(null);
      } else if (deleteState.error) {
        toast.error(deleteState.error || 'Échec de la suppression de la valeur');
      }
    }
    previousDeleteIsPending.current = isDeletePending;
  }, [isDeletePending, deleteState.success, deleteState.error, deleteState.data]);

  const handleAddValue = () => {
    setEditingValue(null);
    setIsDialogOpen(true);
  };

  const handleEditValue = (value: HomeValues) => {
    setEditingValue(value);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (value: HomeValues) => {
    setValueToDelete(value);
    setDeleteModalOpen(true);
  };

  const handleDeleteSuccess = (updatedValues: HomeValues[]) => {
    setHomeValues(updatedValues);
    setDeleteModalOpen(false);
    setValueToDelete(null);
  };

  const handleDialogSuccess = (updatedValues: HomeValues[]) => {
    setHomeValues(updatedValues);
    setIsDialogOpen(false);
  };

  const handleReorderValues = async (reorderedValues: HomeValues[]) => {
    try {
      // Optimistic update
      setHomeValues(reorderedValues);
      
      // Create the order data for the action
      const valueIds = reorderedValues.map(value => value.id);

      const formData = new FormData();
      formData.append('ids', JSON.stringify(valueIds));
      formData.append('csrf_token', csrfToken || '');

      const result = await reorderHomeValuesAction({}, formData);
      if (result.success) {
        toast.success('Valeurs réorganisées avec succès !');
      } else {
        toast.error(result.error || 'Échec de la réorganisation des valeurs');
        // Revert on error
        setHomeValues(values);
      }
    } catch (error) {
      console.error('Error reordering home values:', error);
      toast.error('Échec de la réorganisation des valeurs');
      // Revert on error
      setHomeValues(values);
    }
  };

  // All values are now active since we removed the isActive field
  const activeValues = homeValues;

  const renderValueItem = (value: HomeValues, index: number) => (
    <div className="flex items-start justify-between w-full">
      <div className="flex-1 space-y-2">
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="text-xs">
            #{value.order + 1}
          </Badge>
          <span className="text-sm text-muted-foreground">#{index + 1}</span>
        </div>
        <h3 className="font-medium text-foreground">{value.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {value.description}
        </p>
        {value.highlight && (
          <Badge variant="default" className="text-xs">
            {value.highlight}
          </Badge>
        )}
      </div>
      <div className="flex space-x-2 ml-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEditValue(value)}
          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDeleteClick(value)}
          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );



  return (
    <div className="space-y-6">
      {/* Active Values */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-green-600" />
                <span>Valeurs Actives ({activeValues.length})</span>
              </CardTitle>
              <CardDescription>
                Ces valeurs sont actuellement visibles sur votre site web
              </CardDescription>
            </div>
            <Button onClick={handleAddValue} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une Valeur
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activeValues.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucune valeur active pour le moment.</p>
              <p className="text-sm">Créez votre première valeur pour commencer.</p>
            </div>
          ) : isClient ? (
            <SortableList
              items={activeValues}
              onReorder={handleReorderValues}
              renderItem={renderValueItem}
              getId={(value) => value.id}
            />
          ) : (
            <div className="space-y-3">
              {activeValues.map((value, index) => (
                <div key={value.id} className="border rounded-lg p-4">
                  {renderValueItem(value, index)}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{homeValues.length}</div>
              <div className="text-sm text-muted-foreground">Total Valeurs</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{activeValues.length}</div>
              <div className="text-sm text-muted-foreground">Valeurs Actives</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <HomeValuesDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        value={editingValue}
        onSuccess={handleDialogSuccess}
      />

      <DeleteHomeValueModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        value={valueToDelete}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
