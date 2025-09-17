'use client';

import { useState, useEffect, useRef, startTransition } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { AboutSection } from '@/features/about/shema/aboutSectionSchema';
import { deleteAboutSectionAction } from '@/features/about/actions/deleteAboutSection';
import { reorderAboutSectionsAction } from '@/features/about/actions/reorderAboutSections';
import { formatDateShort } from '@/lib/shared/utils/dateUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AboutSectionDialog from './AboutSectionDialog';
import DeleteAboutSectionModal from './DeleteAboutSectionModal';
import SortableList from '../../common/SortableList';
import { useCSRF } from '@/components/common/CSRFProvider';

interface AboutSectionsManagerProps {
  aboutSections: AboutSection[];
}

type ActionState = {
  success: boolean;
  error?: string;
  data?: AboutSection[];
};

export default function AboutSectionsManager({ aboutSections }: AboutSectionsManagerProps) {
  const { csrfToken } = useCSRF();
  const [sections, setSections] = useState<AboutSection[]>(aboutSections);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<AboutSection | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<AboutSection | null>(null);
  const previousDeleteIsPending = useRef(false);
  const previousReorderIsPending = useRef(false);

  // Delete about section action state
  const [deleteState, deleteFormAction, isDeletePending] = useActionState<ActionState, FormData>(
    deleteAboutSectionAction,
    {
      success: false,
      error: '',
      data: [],
    }
  );

  // Reorder about sections action state
  const [reorderState, reorderFormAction, isReorderPending] = useActionState<ActionState, FormData>(
    reorderAboutSectionsAction,
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
        toast.success('About section deleted successfully!');
        if (deleteState.data) {
          setSections(deleteState.data);
        }
        setDeleteModalOpen(false);
        setSectionToDelete(null);
      } else if (deleteState.error) {
        toast.error(deleteState.error || 'Failed to delete about section');
      }
    }
    previousDeleteIsPending.current = isDeletePending;
  }, [isDeletePending, deleteState.success, deleteState.error, deleteState.data]);

  // Handle reorder success/error
  useEffect(() => {
    if (previousReorderIsPending.current && !isReorderPending) {
      if (reorderState.success) {
        toast.success('About sections reordered successfully!');
        if (reorderState.data) {
          setSections(reorderState.data);
        }
      } else if (reorderState.error) {
        toast.error(reorderState.error || 'Failed to reorder about sections');
      }
    }
    previousReorderIsPending.current = isReorderPending;
  }, [isReorderPending, reorderState.success, reorderState.error, reorderState.data]);

  const handleAddSection = () => {
    setEditingSection(null);
    setIsDialogOpen(true);
  };

  const handleEditSection = (section: AboutSection) => {
    setEditingSection(section);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (section: AboutSection) => {
    setSectionToDelete(section);
    setDeleteModalOpen(true);
  };

  const handleReorderSections = (reorderedSections: AboutSection[]) => {
    // Optimistic update
    setSections(reorderedSections);
    
    // Create form data with new order
    const formData = new FormData();
    reorderedSections.forEach((section, index) => {
      formData.append(`sections[${index}][id]`, section.id);
      formData.append(`sections[${index}][order]`, index.toString());
    });
    formData.append('csrf_token', csrfToken || '');

    startTransition(() => {
      reorderFormAction(formData);
    });
  };

  const handleDeleteSuccess = (updatedSections: AboutSection[]) => {
    setSections(updatedSections);
    setDeleteModalOpen(false);
    setSectionToDelete(null);
  };

  const renderSectionItem = (section: AboutSection, index: number) => (
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        {/* Header with title and order */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {section.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              #{index + 1}
            </span>
          </div>
        </div>

        {/* Content and Image Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Content Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Content
                </span>
              </div>
              <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                {section.content}
              </p>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <span>Last updated: {formatDateShort(section.updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 ml-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEditSection(section)}
          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDeleteClick(section)}
          disabled={isDeletePending || isReorderPending}
          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button onClick={handleAddSection}>
          <Plus className="mr-2 h-4 w-4" />
          Add Section
        </Button>
      </div>

      {sections.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              No about sections created yet
            </p>
            <Button onClick={handleAddSection}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Section
            </Button>
          </CardContent>
        </Card>
      ) : (
        <SortableList
          items={sections}
          onReorder={handleReorderSections}
          renderItem={renderSectionItem}
          getId={(section) => section.id}
        />
      )}

      <AboutSectionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        section={editingSection}
        onSuccess={(updatedSections) => {
          setSections(updatedSections);
          setIsDialogOpen(false);
        }}
      />

      <DeleteAboutSectionModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        section={sectionToDelete}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
