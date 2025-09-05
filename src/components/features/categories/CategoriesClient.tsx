'use client';

import { useState, useCallback } from 'react';
import { Category } from '@/features/categories/schema/categorySchema';
import CategoryGrid from './CategoryGrid';
import CreateCategoryModal from './CreateCategoryModal';
import { Button } from '@/components/ui/button';
import { Plus, Grid3X3, List } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

interface CategoriesClientProps {
  categories: Category[];
}

export default function CategoriesClient({ categories: initialCategories }: CategoriesClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const router = useRouter();

  // Callback to refresh data without hard reload
  const refreshData = useCallback(() => {
    router.refresh();
  }, [router]);

  // Handle category creation success
  const handleCategoryCreated = useCallback((newCategory: Category) => {
    setCategories(prev => [newCategory, ...prev]);
    setCreateModalOpen(false);
  }, []);

  // Handle category update success
  const handleCategoryUpdated = useCallback((updatedCategory: Category) => {
    
    setCategories(prev => {
      const newCategories = prev.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat);
      return newCategories;
    });
  }, []);

  // Handle category deletion success
  const handleCategoryDeleted = useCallback((deletedId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== deletedId));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="sm">
                {viewMode === 'grid' ? <Grid3X3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setViewMode('grid')}>
                <Grid3X3 className="w-4 h-4 mr-2" />
                Grid View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode('list')}>
                <List className="w-4 h-4 mr-2" />
                List View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Create Button */}
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Categories Grid/List */}
      {categories.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No categories yet</h3>
          <p className="text-muted-foreground mb-6">Create your first category to start organizing your products</p>
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create First Category
          </Button>
        </div>
      ) : (
        <CategoryGrid
          categories={categories}
          viewMode={viewMode}
          onCategoryUpdated={handleCategoryUpdated}
          onCategoryDeleted={handleCategoryDeleted}
        />
      )}

      {/* Create Category Modal */}
      <CreateCategoryModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCategoryCreated}
      />
    </div>
  );
}
