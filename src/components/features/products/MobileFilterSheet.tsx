'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Search, 
  Filter, 
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Category } from '@/features/categories/schema/categorySchema';

interface MobileFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  currentFilters: {
    search: string;
    category: string;
    priceRange: string;
    sortBy: string;
    sortOrder: string;
  };
  onApplyFilters: (filters: any) => void;
  onClearFilters: () => void;
}

export function MobileFilterSheet({
  isOpen,
  onClose,
  categories,
  currentFilters,
  onApplyFilters,
  onClearFilters
}: MobileFilterSheetProps) {
  const [localFilters, setLocalFilters] = useState(currentFilters);
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    category: false,
    price: false,
    sort: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilter = (key: string, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      category: 'all',
      priceRange: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = localFilters.search || 
    (localFilters.category && localFilters.category !== 'all') || 
    localFilters.priceRange !== 'all';

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border rounded-t-2xl z-50 md:hidden transform transition-transform duration-300 ease-out">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Filtres</h2>
            {hasActiveFilters && (
              <Badge variant="secondary" className="text-xs">
                {Object.values(localFilters).filter(v => v && v !== 'all' && v !== 'createdAt' && v !== 'desc').length}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-4 space-y-4">
          {/* Search Section */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('search')}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-foreground">Recherche</span>
              </div>
              {expandedSections.search ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            
            {expandedSections.search && (
              <div className="pl-6">
                <Input
                  placeholder="Rechercher des produits..."
                  value={localFilters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="h-11 text-base"
                />
              </div>
            )}
          </div>

          {/* Category Section */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('category')}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-foreground">Catégorie</span>
              </div>
              {expandedSections.category ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            
            {expandedSections.category && (
              <div className="pl-6">
                <Select 
                  value={localFilters.category} 
                  onValueChange={(value) => updateFilter('category', value)}
                >
                  <SelectTrigger className="h-11 text-base">
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="h-11 text-base">Toutes les catégories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id} className="h-11 text-base">
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Price Range Section */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">💰</span>
                <span className="font-medium text-foreground">Prix</span>
              </div>
              {expandedSections.price ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            
            {expandedSections.price && (
              <div className="pl-6">
                <Select 
                  value={localFilters.priceRange} 
                  onValueChange={(value) => updateFilter('priceRange', value)}
                >
                  <SelectTrigger className="h-11 text-base">
                    <SelectValue placeholder="Tous les prix" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="h-11 text-base">Tous les prix</SelectItem>
                    <SelectItem value="budget" className="h-11 text-base">Moins de 100 MAD</SelectItem>
                    <SelectItem value="mid" className="h-11 text-base">100 MAD - 300 MAD</SelectItem>
                    <SelectItem value="premium" className="h-11 text-base">300 MAD+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Sort Section */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('sort')}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">🔄</span>
                <span className="font-medium text-foreground">Trier</span>
              </div>
              {expandedSections.sort ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            
            {expandedSections.sort && (
              <div className="pl-6 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Trier par
                  </label>
                  <Select 
                    value={localFilters.sortBy} 
                    onValueChange={(value) => updateFilter('sortBy', value)}
                  >
                    <SelectTrigger className="h-11 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt" className="h-11 text-base">Plus récent</SelectItem>
                      <SelectItem value="name" className="h-11 text-base">Nom A-Z</SelectItem>
                      <SelectItem value="price" className="h-11 text-base">Prix</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Ordre
                  </label>
                  <Select 
                    value={localFilters.sortOrder} 
                    onValueChange={(value) => updateFilter('sortOrder', value)}
                  >
                    <SelectTrigger className="h-11 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc" className="h-11 text-base">Décroissant</SelectItem>
                      <SelectItem value="asc" className="h-11 text-base">Croissant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border p-6 space-y-3">
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="w-full h-11"
            >
              Effacer tous les filtres
            </Button>
          )}
          <Button
            onClick={handleApplyFilters}
            className="w-full h-11 bg-primary hover:bg-primary/90"
          >
            Appliquer les filtres
          </Button>
        </div>
      </div>
    </>
  );
}
