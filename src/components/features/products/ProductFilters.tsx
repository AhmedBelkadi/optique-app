'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  X, 
  ChevronDown,
  ChevronUp,
  SlidersHorizontal
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description?: string | null;
}

interface ProductFiltersProps {
  categories: Category[];
}

const ProductFilters = React.memo(({ categories }: ProductFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');
  const [brandFilter, setBrandFilter] = useState(searchParams.get('brand') || '');
  const [referenceFilter, setReferenceFilter] = useState(searchParams.get('reference') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');
  const [isExpanded, setIsExpanded] = useState(false);

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (categoryFilter) params.set('category', categoryFilter);
    if (brandFilter) params.set('brand', brandFilter);
    if (referenceFilter) params.set('reference', referenceFilter);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sortBy) params.set('sortBy', sortBy);
    if (sortOrder) params.set('sortOrder', sortOrder);
    
    // Always reset to page 1 when filters change
    params.set('page', '1');

    const newQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (newQuery === currentQuery) return;

    const newURL = newQuery ? `?${newQuery}` : '/admin/products';
    router.push(newURL, { scroll: false });
  }, [
    searchTerm,
    categoryFilter,
    brandFilter,
    referenceFilter,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    searchParams,
    router,
  ]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setCategoryFilter('');
    setBrandFilter('');
    setReferenceFilter('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('createdAt');
    setSortOrder('desc');
    
    // Apply the cleared filters immediately
    const newURL = '/admin/products';
    router.push(newURL, { scroll: false });
  }, [router]);

  const hasActiveFilters =
    searchTerm || categoryFilter || brandFilter || referenceFilter || minPrice || maxPrice ||
    sortBy !== 'createdAt' || sortOrder !== 'desc';

  const activeFilterCount = [
    searchTerm,
    categoryFilter,
    brandFilter,
    referenceFilter,
    minPrice,
    maxPrice,
    sortBy !== 'createdAt',
    sortOrder !== 'desc'
  ].filter(Boolean).length;

  // Check if filters are different from default state
  const hasChangedFilters = hasActiveFilters;

  return (
    <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
      <CardContent className="p-4">
        {/* Main Filter Bar - Always Visible */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Search and Category - Primary Filters */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1 min-w-0 w-full">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par nom, marque, référence..."
                className="h-10 pl-10 border-border focus:border-primary focus:ring-primary w-full bg-background"
              />
            </div>
            
            <div className="w-full sm:w-48">
              <Select
                value={categoryFilter || 'all'}
                onValueChange={(val) => setCategoryFilter(val === 'all' ? '' : val)}
              >
                <SelectTrigger className="h-10 border-border focus:border-primary focus:ring-primary w-full bg-background">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-10 w-full sm:w-40 border-border focus:border-primary focus:ring-primary bg-background">
                <SelectValue placeholder="Trier par..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date de création</SelectItem>
                <SelectItem value="name">Nom du produit</SelectItem>
                <SelectItem value="price">Prix</SelectItem>
                <SelectItem value="brand">Marque</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="h-10 w-full sm:w-32 border-border focus:border-primary focus:ring-primary bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">↓ Décroissant</SelectItem>
                <SelectItem value="asc">↑ Croissant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            {/* Active Filters Badge */}
            {hasActiveFilters && (
              <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20 px-2 py-1">
                {activeFilterCount} filtre{activeFilterCount > 1 ? 's' : ''}
              </Badge>
            )}
            
            {/* Apply Filters Button */}
            <Button
              variant="default"
              size="sm"
              onClick={applyFilters}
              className="h-10 px-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
            >
              <Search className="w-4 h-4 mr-2" />
              Appliquer les filtres
            </Button>
            
            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="h-10 px-4 border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive/30"
              >
                <X className="w-4 h-4 mr-2" />
                Effacer les filtres
              </Button>
            )}
            
            {/* Advanced Filters Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-10 px-3 border-border hover:bg-muted"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filtres avancés
              {isExpanded ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>

        {/* Advanced Filters - Collapsible */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-foreground">Filtres avancés</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3 h-3 mr-1" />
                  Réinitialiser
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Brand Filter */}
              <div className="space-y-2">
                <Label htmlFor="brand" className="text-xs font-medium text-foreground">Marque</Label>
                <Input
                  id="brand"
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  placeholder="Ex: Ray-Ban, Oakley..."
                  className="h-9 border-border focus:border-primary focus:ring-primary bg-background"
                />
              </div>

              {/* Reference Filter */}
              <div className="space-y-2">
                <Label htmlFor="reference" className="text-xs font-medium text-foreground">Référence</Label>
                <Input
                  id="reference"
                  value={referenceFilter}
                  onChange={(e) => setReferenceFilter(e.target.value)}
                  placeholder="Ex: RB2140, OO9013..."
                  className="h-9 border-border focus:border-primary focus:ring-primary bg-background"
                />
              </div>

              {/* Min Price */}
              <div className="space-y-2">
                <Label htmlFor="minPrice" className="text-xs font-medium text-foreground">Prix minimum</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 text-sm font-medium">$</span>
                  <Input
                    id="minPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="h-9 pl-7 border-border focus:border-primary focus:ring-primary bg-background"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Max Price */}
              <div className="space-y-2">
                <Label htmlFor="maxPrice" className="text-xs font-medium text-foreground">Prix maximum</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 text-sm font-medium">$</span>
                  <Input
                    id="maxPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="h-9 pl-7 border-border focus:border-primary focus:ring-primary bg-background"
                    placeholder="999.99"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

ProductFilters.displayName = 'ProductFilters';
export default ProductFilters;
