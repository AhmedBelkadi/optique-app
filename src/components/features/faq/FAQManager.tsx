'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FAQ } from '@/features/faqs/schema/faqSchema';

import { reorderFAQsAction } from '@/features/faqs/actions/reorderFAQs';
import FAQDialog from './FAQDialog';
import DeleteFAQModal from './DeleteFAQModal';
import SortableList from '../../common/SortableList';
import { useCSRF } from '@/components/common/CSRFProvider';

interface FAQManagerProps {
  faqs: FAQ[];
}

export default function FAQManager({ faqs }: FAQManagerProps) {
  const { csrfToken } = useCSRF();
  const [faqsList, setFaqsList] = useState<FAQ[]>(faqs);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<FAQ | null>(null);


  // All FAQs are now active since we removed the isActive field
  const activeFAQs = faqsList;

  const getThemeFromQuestion = (question: string) => {
    const q = question.toLowerCase();
    if (q.includes('exam') || q.includes('eye care') || q.includes('vision')) {
      return 'Eye Care & Exams';
    } else if (q.includes('frame') || q.includes('glasses') || q.includes('lens')) {
      return 'Frames & Glasses';
    } else if (q.includes('contact') || q.includes('fitting')) {
      return 'Contact Lenses';
    } else if (q.includes('appointment') || q.includes('hour') || q.includes('time')) {
      return 'Appointments & Hours';
    } else if (q.includes('insurance') || q.includes('warranty') || q.includes('coverage')) {
      return 'Insurance & Warranty';
    } else {
      return 'General Questions';
    }
  };

  const handleAddFAQ = () => {
    setEditingFAQ(null);
    setIsDialogOpen(true);
  };

  const handleEditFAQ = (faq: FAQ) => {
    setEditingFAQ(faq);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (faq: FAQ) => {
    setFaqToDelete(faq);
    setDeleteModalOpen(true);
  };



  const handleReorderFAQs = async (reorderedFAQs: FAQ[]) => {
    try {
      // Optimistic update
      setFaqsList(reorderedFAQs);
      
      // Create FormData with CSRF token
      const formData = new FormData();
      reorderedFAQs.forEach((faq, index) => {
        formData.append(`faqs[${index}][id]`, faq.id);
      });
      formData.append('csrf_token', csrfToken || '');

      const result = await reorderFAQsAction({}, formData);
      if (result.success) {
        toast.success('FAQs reordered successfully!');
      } else {
        toast.error(result.error || 'Failed to reorder FAQs');
        // Revert on error
        setFaqsList(faqs);
      }
    } catch (error) {
      console.error('Error reordering FAQs:', error);
      toast.error('Failed to reorder FAQs');
      // Revert on error
      setFaqsList(faqs);
    }
  };

  const handleFormSuccess = (updatedFAQ: FAQ) => {
    if (editingFAQ) {
      // Update existing FAQ
      setFaqsList(prev => prev.map(f => f.id === updatedFAQ.id ? updatedFAQ : f));
    } else {
      // Add new FAQ
      setFaqsList(prev => [...prev, updatedFAQ]);
    }
    setIsDialogOpen(false);
    setEditingFAQ(null);
  };

  const handleDeleteSuccess = () => {
    if (faqToDelete) {
      setFaqsList(prev => prev.filter(f => f.id !== faqToDelete.id));
    }
    setDeleteModalOpen(false);
    setFaqToDelete(null);
  };

  const renderFAQItem = (faq: FAQ, index: number) => (
    <div className="flex items-start justify-between w-full">
      <div className="flex-1 space-y-2">
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="text-xs">
            {getThemeFromQuestion(faq.question)}
          </Badge>
          <span className="text-sm text-muted-foreground">#{faq.order + 1}</span>
        </div>
        <h3 className="font-medium text-foreground">{faq.question}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {faq.answer}
        </p>
      </div>
      <div className="flex space-x-2 ml-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEditFAQ(faq)}
          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
        >
        
          <Edit className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDeleteClick(faq)}
          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );



  return (
    <div className="space-y-6">
      {/* Active FAQs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-green-600" />
                <span>Active FAQs ({activeFAQs.length})</span>
              </CardTitle>
              <CardDescription>
                These FAQs are currently visible on your website
              </CardDescription>
            </div>
            <Button onClick={handleAddFAQ} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add New FAQ
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activeFAQs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No active FAQs yet.</p>
              <p className="text-sm">Create your first FAQ to get started.</p>
            </div>
          ) : (
            <SortableList
              items={activeFAQs}
              onReorder={handleReorderFAQs}
              renderItem={renderFAQItem}
              getId={(faq) => faq.id}
            />
          )}
        </CardContent>
      </Card>



      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{faqsList.length}</div>
              <div className="text-sm text-muted-foreground">Total FAQs</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{activeFAQs.length}</div>
              <div className="text-sm text-muted-foreground">Active FAQs</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit FAQ Form */}
      <FAQDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        faq={editingFAQ}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Modal */}
      {faqToDelete && (
        <DeleteFAQModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          faq={faqToDelete}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}
