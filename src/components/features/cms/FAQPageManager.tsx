'use client';

import { useState, useEffect, useRef, startTransition } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import { useCSRF } from '@/components/common/CSRFProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 

  HelpCircle, 

  Plus, 
  Edit, 
  Eye, 
  CheckCircle,
  AlertCircle,
  Clock,

  Trash2
} from 'lucide-react';
import FAQModal from './FAQModal';
import DeleteFAQModal from './DeleteFAQModal';
import SortableList from './SortableList';
import { reorderFAQsAction, ReorderFAQsState } from '@/features/faqs/actions/reorderFAQs';
import { formatDateShort } from '@/lib/shared/utils/dateUtils';

interface FAQPageManagerProps {
  faqs: any[];
}

export default function FAQPageManager({ 
  faqs
}: FAQPageManagerProps) {
  const { csrfToken } = useCSRF();
  const [activeTab, setActiveTab] = useState('overview');
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<any>(null);
  const [deletingFAQ, setDeletingFAQ] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [faqList, setFaqList] = useState<any[]>(faqs);
  const previousReorderIsPending = useRef(false);

  // Reorder FAQs action state
  const [reorderState, reorderFormAction, isReorderPending] = useActionState<ReorderFAQsState, FormData>(
    reorderFAQsAction,
    {
      success: false,
      error: '',
      data: [],
    }
  );

  // Handle reorder success/error
  useEffect(() => {
    if (previousReorderIsPending.current && !isReorderPending) {
      if (reorderState.success) {
        toast.success('FAQs réorganisées avec succès !');
        if (reorderState.data) {
          setFaqList(reorderState.data);
        }
      } else if (reorderState.error) {
        toast.error(reorderState.error || 'Échec de la réorganisation des FAQs');
      }
    }
    previousReorderIsPending.current = isReorderPending;
  }, [isReorderPending, reorderState.success, reorderState.error, reorderState.data]);

  // Calculate completion status
  const totalSections = 1;
  const completedSections = [
    faqList.length > 0
  ].filter(Boolean).length;
  
  const completionPercentage = (completedSections / totalSections) * 100;

  // Get status indicators
  const getSectionStatus = (hasContent: boolean, isRequired: boolean = true) => {
    if (!hasContent && isRequired) {
      return { icon: AlertCircle, color: 'text-red-500', bgColor: 'bg-red-50', status: 'Missing' };
    } else if (hasContent) {
      return { icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-50', status: 'Complete' };
    } else {
      return { icon: Clock, color: 'text-yellow-500', bgColor: 'bg-yellow-50', status: 'Optional' };
    }
  };

  const faqsStatus = getSectionStatus(faqList.length > 0);

  const handleFAQSuccess = (updatedFAQs: any[]) => {
    setFaqList(updatedFAQs);
    setShowFAQModal(false);
    setEditingFAQ(null);
  };

  const handleAddFAQ = () => {
    setEditingFAQ(null);
    setShowFAQModal(true);
  };

  const handleEditFAQ = (faq: any) => {
    setEditingFAQ(faq);
    setShowFAQModal(true);
  };

  const handleDeleteFAQ = (faq: any) => {
    setDeletingFAQ(faq);
  };

  const handleDeleteSuccess = (updatedFAQs: any[]) => {
    setFaqList(updatedFAQs);
    setDeletingFAQ(null);
  };



  const handleReorderFAQs = (reorderedFAQs: any[]) => {
    // Optimistic update
    setFaqList(reorderedFAQs);
    
    // Create form data with new order
    const formData = new FormData();
    reorderedFAQs.forEach((faq, index) => {
      formData.append(`faqs[${index}][id]`, faq.id);
      formData.append(`faqs[${index}][order]`, index.toString());
    });

    // Add CSRF token
    if (csrfToken) {
      formData.append('csrf_token', csrfToken);
    }

    startTransition(() => {
      reorderFormAction(formData);
    });
  };

  // Filter and search FAQs
  const filteredFAQs = faqList.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const renderFAQItem = (faq: any, index: number) => (
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        {/* Header with question and order */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {faq.question}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              #{index + 1}
            </span>
          </div>
        </div>

        {/* Answer Section */}
        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Réponse
            </span>
          </div>
          <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
            {faq.answer}
          </p>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <span>Ordre: {faq.order}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <span>Dernière mise à jour: {formatDateShort(faq.updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 ml-4">
        <Button
          size="sm"
          onClick={() => handleEditFAQ(faq)}
          className="h-8 w-8 p-0 bg-emerald-500 hover:bg-emerald-500/90"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDeleteFAQ(faq)}
          disabled={isReorderPending}
          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Completion Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Complétion de la page FAQ
          </CardTitle>
          <CardDescription>
            Suivez votre progression dans la configuration de la page FAQ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {completedSections} sur {totalSections} sections complètes
            </span>
            <Badge variant={completionPercentage === 100 ? 'default' : 'secondary'}>
              {Math.round(completionPercentage)}%
            </Badge>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Actions rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleAddFAQ}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter une nouvelle FAQ
            </Button>
            <Button 
              variant="outline"
              onClick={() => setActiveTab('faqs')}
              className="flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              Gérer les FAQs
            </Button>
         
          </div>
        </CardContent>
      </Card>

      {/* Content Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Vue d'ensemble du contenu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {/* FAQs */}
            <div className={`p-4 rounded-lg border ${faqsStatus.bgColor}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${faqsStatus.bgColor}`}>
                  <faqsStatus.icon className={`h-4 w-4 ${faqsStatus.color}`} />
                </div>
                <div>
                  <p className="font-medium text-sm">Entrées FAQ</p>
                  <Badge variant={faqsStatus.status === 'Complete' ? 'default' : 'secondary'}>
                    {faqList.length} entrées
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50 border border-border">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
          >
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger 
            value="faqs" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
          >
            FAQs
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Résumé de la page FAQ</CardTitle>
              <CardDescription>
                Vue d'ensemble de votre contenu de page FAQ et de sa structure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* FAQs Summary */}
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Entrées FAQ
                  </h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Total:</strong> {faqList.length} entrées</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{faqList.length}</div>
                  <div className="text-sm text-muted-foreground">Total des FAQs</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{completionPercentage}%</div>
                  <div className="text-sm text-muted-foreground">Page complète</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Entrées FAQ
                </span>
                <Button onClick={handleAddFAQ}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une FAQ
                </Button>
              </CardTitle>
              <CardDescription>
                Gérez vos questions fréquemment posées
              </CardDescription>
            </CardHeader>
          
            <CardContent>
              {/* Results Counter and Bulk Actions */}
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Affichage de {filteredFAQs.length} sur {faqList.length} FAQs
                  {searchTerm && (
                    <span className="ml-2">
                      (filtrées)
                    </span>
                  )}
                </div>
              
              </div>
              
              {filteredFAQs.length === 0 ? (
                searchTerm ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune FAQ ne correspond à vos critères de recherche</p>
                    <p className="text-sm">Essayez d'ajuster votre recherche</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune entrée FAQ pour le moment</p>
                    <p className="text-sm">Créez votre première FAQ pour commencer</p>
                  </div>
                )
              ) : (
                <SortableList
                  items={filteredFAQs}
                  onReorder={handleReorderFAQs}
                  renderItem={renderFAQItem}
                  getId={(faq) => faq.id}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* FAQ Modal */}
      <FAQModal
        faq={editingFAQ}
        isOpen={showFAQModal}
        onClose={() => setShowFAQModal(false)}
        onSuccess={handleFAQSuccess}
      />

      {/* Delete FAQ Modal */}
      {deletingFAQ && (
        <DeleteFAQModal
          faq={deletingFAQ}
          isOpen={!!deletingFAQ}
          onClose={() => setDeletingFAQ(null)}
          onSuccess={handleDeleteSuccess}
        />
      )}

    </div>
  );
}
