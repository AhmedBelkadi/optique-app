'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
   
  Search, 
  X,
  ChevronLeft,
  ChevronRight,
  FilterX,
  SlidersHorizontal
} from 'lucide-react';
import { ProductCard } from '@/components/ui/product-card';
import { MobileFilterSheet } from './MobileFilterSheet';
import { QuickFilterChips } from './QuickFilterChips';
import { Category } from '@/features/categories/schema/categorySchema';
import { PAGE_SIZE } from '@/features/products/config';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: {
    id: string;
    name: string;
  };
}

interface ProductsPageClientProps {
  products: Product[];
  categories: Category[];
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
  searchParams: {
    search?: string;
    category?: string;
    priceRange?: string;
    page?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export function ProductsPageClient({
  products,
  categories,
  pagination,
  searchParams
}: ProductsPageClientProps) {
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({
    search: searchParams.search || '',
    category: searchParams.category || 'all',
    priceRange: searchParams.priceRange || 'all',
    sortBy: searchParams.sortBy || 'createdAt',
    sortOrder: searchParams.sortOrder || 'desc'
  });

  // Check if any filters are active
  const hasActiveFilters = Boolean(currentFilters.search || 
    (currentFilters.category && currentFilters.category !== 'all') || 
    currentFilters.priceRange !== 'all');

  const handleApplyFilters = (filters: any) => {
    const loading = document.getElementById('products-grid-loading');
    if (loading) loading.classList.remove('hidden');
    const params = new URLSearchParams();
    
    if (filters.search) params.set('search', filters.search);
    if (filters.category && filters.category !== 'all') params.set('category', filters.category);
    if (filters.priceRange && filters.priceRange !== 'all') params.set('priceRange', filters.priceRange);
    if (filters.sortBy && filters.sortBy !== 'createdAt') params.set('sortBy', filters.sortBy);
    if (filters.sortOrder && filters.sortOrder !== 'desc') params.set('sortOrder', filters.sortOrder);
    
    const queryString = params.toString();
    window.location.href = `/products${queryString ? `?${queryString}` : ''}`;
  };

  const handleClearFilters = () => {
    const loading = document.getElementById('products-grid-loading');
    if (loading) loading.classList.remove('hidden');
    window.location.href = '/products';
  };

  const handleCategoryChange = (categoryId: string) => {
    const loading = document.getElementById('products-grid-loading');
    if (loading) loading.classList.remove('hidden');
    const params = new URLSearchParams(window.location.search);
    
    if (categoryId === 'all') {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    
    const queryString = params.toString();
    window.location.href = `/products${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-30">
        <Button
          onClick={() => setIsFilterSheetOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        >
          <SlidersHorizontal className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Quick Filter Chips */}
      <div className="md:hidden px-4 py-4 bg-background border-b border-border">
        <QuickFilterChips
          categories={categories}
          currentCategory={currentFilters.category}
          onCategoryChange={handleCategoryChange}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Desktop Filters and Search */}
      <section className="hidden md:block py-8 lg:py-12 bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form className="space-y-6">
            {/* Search Bar - Full Width on Mobile */}
            <div className="flex flex-col gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 w-5 h-5" />
                <Input 
                  name="search"
                  placeholder="Rechercher des produits par nom, description ou référence..." 
                  className="pl-12 h-12 text-base border-border focus:border-primary focus:ring-primary/20"
                  defaultValue={currentFilters.search}
                />
              </div>
              <Button type="submit" size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                <Search className="w-5 h-5 mr-2" />
                Rechercher
              </Button>
            </div>

            {/* Filters Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Catégorie
                </label>
                <Select name="category" defaultValue={currentFilters.category}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Toutes les Catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les Catégories</SelectItem>
                    {categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Fourchette de Prix
                </label>
                <Select name="priceRange" defaultValue={currentFilters.priceRange}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Tous les Prix" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les Prix</SelectItem>
                    <SelectItem value="budget">Moins de 100$</SelectItem>
                    <SelectItem value="mid">100$ - 300$</SelectItem>
                    <SelectItem value="premium">300$+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Trier Par
                </label>
                <Select name="sortBy" defaultValue={currentFilters.sortBy}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Plus Récent en Premier</SelectItem>
                    <SelectItem value="name">Nom A-Z</SelectItem>
                    <SelectItem value="price">Prix</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Ordre
                </label>
                <Select name="sortOrder" defaultValue={currentFilters.sortOrder}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Décroissant</SelectItem>
                    <SelectItem value="asc">Croissant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <section className="py-4 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Filtres actifs:</span>
              {currentFilters.search && (
                <Badge variant="secondary" className="gap-1">
                  Recherche: {currentFilters.search}
                  <Button variant="ghost" size="sm" className="h-auto p-0 ml-1" asChild>
                    <a href={`/products?${new URLSearchParams({
                      ...(currentFilters.category && currentFilters.category !== 'all' && { category: currentFilters.category }),
                      ...(currentFilters.priceRange && { priceRange: currentFilters.priceRange }),
                      ...(currentFilters.sortBy && { sortBy: currentFilters.sortBy }),
                      ...(currentFilters.sortOrder && { sortOrder: currentFilters.sortOrder })
                    })}`}>
                      <X className="w-3 h-3" />
                    </a>
                  </Button>
                </Badge>
              )}
              {currentFilters.category && currentFilters.category !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Catégorie: {categories.find(c => c.id === currentFilters.category)?.name}
                  <Button variant="ghost" size="sm" className="h-auto p-0 ml-1" asChild>
                    <a href={`/products?${new URLSearchParams({
                      ...(currentFilters.search && { search: currentFilters.search }),
                      ...(currentFilters.priceRange && { priceRange: currentFilters.priceRange }),
                      ...(currentFilters.sortBy && { sortBy: currentFilters.sortBy }),
                      ...(currentFilters.sortOrder && { sortOrder: currentFilters.sortOrder })
                    })}`}>
                      <X className="w-3 h-3" />
                    </a>
                  </Button>
                </Badge>
              )}
              {currentFilters.priceRange && currentFilters.priceRange !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Prix: {currentFilters.priceRange === 'budget' ? 'Moins de 100 MAD' : currentFilters.priceRange === 'mid' ? '100 MAD - 300 MAD' : '300 MAD+'}
                  <Button variant="ghost" size="sm" className="h-auto p-0 ml-1" asChild>
                    <a href={`/products?${new URLSearchParams({
                      ...(currentFilters.search && { search: currentFilters.search }),
                      ...(currentFilters.category && currentFilters.category !== 'all' && { category: currentFilters.category }),
                      ...(currentFilters.sortBy && { sortBy: currentFilters.sortBy }),
                      ...(currentFilters.sortOrder && { sortOrder: currentFilters.sortOrder })
                    })}`}>
                      <X className="w-3 h-3" />
                    </a>
                  </Button>
                </Badge>
              )}
              <Button variant="ghost" size="sm" className="ml-auto" asChild>
                <a href="/products">
                  <FilterX className="w-4 h-4 mr-1" />
                  Effacer tout
                </a>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Results Summary */}
      {products.length > 0 && (
        <section className="py-6 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-muted-foreground text-sm sm:text-base">
                Affichage de {((pagination.page - 1) * PAGE_SIZE) + 1} à {Math.min(pagination.page * PAGE_SIZE, pagination.total)} sur {pagination.total} produits
              </p>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" asChild>
                  <a href="/products">
                    <FilterX className="w-4 h-4 mr-1" />
                    Effacer les Filtres
                  </a>
                </Button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Products Grid - Mobile Optimized with skeleton */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id="products-grid-loading" className="hidden">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-square bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
              {products.map((product: any) => (
                <div key={product.id} className="group">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-square bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <section className="py-8 bg-muted/30 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Pagination Info */}
              <div className="text-sm text-muted-foreground">
                Page {pagination.page} sur {pagination.totalPages} ({pagination.total} produits)
              </div>
              
              {/* Pagination Controls */}
              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                {pagination.page > 1 && (
                  <Button variant="default" size="sm" asChild>
                    <a href={`/products?${new URLSearchParams({
                      ...(currentFilters.search && { search: currentFilters.search }),
                      ...(currentFilters.category && currentFilters.category !== 'all' && { category: currentFilters.category }),
                      ...(currentFilters.priceRange && { priceRange: currentFilters.priceRange }),
                      ...(currentFilters.sortBy && { sortBy: currentFilters.sortBy }),
                      ...(currentFilters.sortOrder && { sortOrder: currentFilters.sortOrder }),
                      page: (pagination.page - 1).toString()
                    })}`}>
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Précédent
                    </a>
                  </Button>
                )}
                
                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(7, pagination.totalPages) }, (_, i) => {
                    let pageNum: number;
                    
                    // Smart pagination display
                    if (pagination.totalPages <= 7) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 4) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 3) {
                      pageNum = pagination.totalPages - 6 + i;
                    } else {
                      pageNum = pagination.page - 3 + i;
                    }
                    
                    if (pageNum < 1 || pageNum > pagination.totalPages) return null;
                    
                    const isActive = pageNum === pagination.page;
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        asChild
                      >
                        <a href={`/products?${new URLSearchParams({
                          ...(currentFilters.search && { search: currentFilters.search }),
                          ...(currentFilters.category && currentFilters.category !== 'all' && { category: currentFilters.category }),
                          ...(currentFilters.priceRange && { priceRange: currentFilters.priceRange }),
                          ...(currentFilters.sortBy && { sortBy: currentFilters.sortBy }),
                          ...(currentFilters.sortOrder && { sortOrder: currentFilters.sortOrder }),
                          page: pageNum.toString()
                        })}`}>
                          {pageNum}
                        </a>
                      </Button>
                    );
                  })}
                </div>
                
                {/* Next Button */}
                {pagination.page < pagination.totalPages && (
                  <Button variant="default" size="sm" asChild>
                    <a href={`/products?${new URLSearchParams({
                      ...(currentFilters.search && { search: currentFilters.search }),
                      ...(currentFilters.category && currentFilters.category !== 'all' && { category: currentFilters.category }),
                      ...(currentFilters.priceRange && { priceRange: currentFilters.priceRange }),
                      ...(currentFilters.sortBy && { sortBy: currentFilters.sortBy }),
                      ...(currentFilters.sortOrder && { sortOrder: currentFilters.sortOrder }),
                      page: (pagination.page + 1).toString()
                    })}`}>
                      Suivant
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Mobile Filter Sheet */}
      <MobileFilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        categories={categories}
        currentFilters={currentFilters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />
    </>
  );
}
