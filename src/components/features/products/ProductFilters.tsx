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

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (categoryFilter) params.set('category', categoryFilter);
    if (brandFilter) params.set('brand', brandFilter);
    if (referenceFilter) params.set('reference', referenceFilter);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sortBy) params.set('sortBy', sortBy);
    if (sortOrder) params.set('sortOrder', sortOrder);

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateURL();
    }, 300); // debounce delay

    return () => clearTimeout(timeout);
  }, [updateURL]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setCategoryFilter('');
    setBrandFilter('');
    setReferenceFilter('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('createdAt');
    setSortOrder('desc');
  }, []);

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

  return (
    <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
      <CardContent className="p-4">
        {/* Main Filter Bar - Always Visible */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Search and Category - Primary Filters */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1 min-w-0">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher des produits..."
                className="h-10 pl-10 border-border focus:border-primary focus:ring-primary"
              />
            </div>
            
            <div className="w-full sm:w-48">
              <Select
                value={categoryFilter || 'all'}
                onValueChange={(val) => setCategoryFilter(val === 'all' ? '' : val)}
              >
                <SelectTrigger className="h-10 border-border focus:border-primary focus:ring-primary">
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
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-10 w-40 border-border focus:border-primary focus:ring-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date</SelectItem>
                <SelectItem value="name">Nom</SelectItem>
                <SelectItem value="price">Prix</SelectItem>
                <SelectItem value="brand">Marque</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="h-10 w-32 border-border focus:border-primary focus:ring-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">↓ Décroissant</SelectItem>
                <SelectItem value="asc">↑ Croissant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20">
                {activeFilterCount}
              </Badge>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-10 px-3"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filtres
              {isExpanded ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </Button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-10 px-3 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4 mr-1" />
                Effacer
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Filters - Collapsible */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Brand Filter */}
              <div className="space-y-2">
                <Label htmlFor="brand" className="text-xs font-medium text-muted-foreground">Marque</Label>
                <Input
                  id="brand"
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  placeholder="Marque..."
                  className="h-9 border-border focus:border-primary focus:ring-primary"
                />
              </div>

              {/* Reference Filter */}
              <div className="space-y-2">
                <Label htmlFor="reference" className="text-xs font-medium text-muted-foreground">Référence</Label>
                <Input
                  id="reference"
                  value={referenceFilter}
                  onChange={(e) => setReferenceFilter(e.target.value)}
                  placeholder="Référence..."
                  className="h-9 border-border focus:border-primary focus:ring-primary"
                />
              </div>

              {/* Min Price */}
              <div className="space-y-2">
                <Label htmlFor="minPrice" className="text-xs font-medium text-muted-foreground">Prix Min</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 text-sm">$</span>
                  <Input
                    id="minPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="h-9 pl-7 border-border focus:border-primary focus:ring-primary"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Max Price */}
              <div className="space-y-2">
                <Label htmlFor="maxPrice" className="text-xs font-medium text-muted-foreground">Prix Max</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 text-sm">$</span>
                  <Input
                    id="maxPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="h-9 pl-7 border-border focus:border-primary focus:ring-primary"
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
