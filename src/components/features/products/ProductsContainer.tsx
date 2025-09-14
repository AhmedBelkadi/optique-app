'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import ProductGrid from './ProductGrid';
import { Product } from '@/features/products/schema/productSchema';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAllProductsAction } from '@/features/products/actions/getAllProductsAction';
import { cn } from '@/lib/utils';
import { logError } from '@/lib/errorHandling';

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface ProductsContainerProps {
  initialProducts: Product[];
  pagination?: PaginationData;
  currentPage: number;
}

type SortBy = 'name' | 'price' | 'createdAt' | 'brand';
type SortOrder = 'asc' | 'desc';

export default function ProductsContainer({ 
  initialProducts, 
  pagination,
  currentPage 
}: ProductsContainerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [paginationData, setPaginationData] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current page from URL - SIMPLE VERSION
  const currentPageFromURL = parseInt(searchParams.get('page') || '1');

  // Fetch products - NO DEPENDENCIES VERSION
  const fetchProducts = useCallback(async () => {
    const currentPage = parseInt(searchParams.get('page') || '1');
    console.log('🚀 FETCHING PRODUCTS - Page:', currentPage);
    
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const reference = searchParams.get('reference');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder');

    const filters = {
      search: search || undefined,
      categoryIds: category ? [category] : undefined,
      brand: brand || undefined,
      reference: reference || undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      sortBy: (['name', 'price', 'createdAt', 'brand'].includes(sortBy || '') ? sortBy : 'createdAt') as SortBy,
      sortOrder: (['asc', 'desc'].includes(sortOrder || '') ? sortOrder : 'desc') as SortOrder,
      page: currentPage,
      limit: 12
    };
    
    console.log('🔍 Filters:', filters);
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getAllProductsAction(filters);
      console.log('📦 Result:', result);
      
      if (result.success && result.data) {
        setProducts(result.data);
        setPaginationData(result.pagination || null);
        console.log('✅ SUCCESS - Page:', currentPage, 'Products:', result.data.length);
      } else {
        setError(result.error || 'Failed to fetch products');
        console.log('❌ ERROR:', result.error);
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred while fetching products';
      setError(errorMessage);
      console.log('💥 EXCEPTION:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  // Fetch on mount and when URL changes
  useEffect(() => {
    console.log('🔄 EFFECT TRIGGERED - Page:', currentPageFromURL);
    fetchProducts();
  }, [searchParams, fetchProducts]);

  const handleDelete = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handlePageChange = useCallback((page: number) => {
    console.log('🎯 PAGE CHANGE CLICKED:', page);
    console.log('📍 Current URL:', window.location.href);
    
    if (page < 1 || (paginationData && page > paginationData.totalPages)) {
      console.log('❌ Invalid page number');
      return;
    }
    
    // Create new URL with page parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    const newUrl = `/admin/products?${params.toString()}`;
    
    console.log('🚀 Navigating to:', newUrl);
    
    // Try using Next.js router instead of window.location
    router.push(newUrl);
  }, [searchParams, paginationData, router]);

  // Generate pagination items
  const paginationItems = useMemo(() => {
    if (!paginationData || paginationData.totalPages <= 1) return [];

    const items: Array<{ type: 'page'; page: number; isActive: boolean } | { type: 'ellipsis'; key: string }> = [];
    const { totalPages } = paginationData;
    const maxVisiblePages = 5;
    const activePage = currentPageFromURL;
    
    // Calculate visible page range
    let startPage = Math.max(1, activePage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page and ellipsis
    if (startPage > 1) {
      items.push({
        type: 'page',
        page: 1,
        isActive: activePage === 1
      });
      
      if (startPage > 2) {
        items.push({ type: 'ellipsis', key: 'ellipsis1' });
      }
    }

    // Visible pages
    for (let i = startPage; i <= endPage; i++) {
      items.push({
        type: 'page',
        page: i,
        isActive: i === activePage
      });
    }

    // Last page and ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push({ type: 'ellipsis', key: 'ellipsis2' });
      }
      
      items.push({
        type: 'page',
        page: totalPages,
        isActive: activePage === totalPages
      });
    }

    return items;
  }, [paginationData, currentPageFromURL]);

  const renderPaginationItems = () => {
    if (paginationItems.length === 0) return null;

    return paginationItems.map((item, index) => {
      if (item.type === 'ellipsis') {
        return (
          <PaginationItem key={item.key}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      return (
        <PaginationItem key={item.page}>
          <PaginationLink
            href="#"
            isActive={item.isActive}
            onClick={(e) => {
              e.preventDefault();
              if (typeof item.page === 'number') {
                handlePageChange(item.page);
              }
            }}
            className={cn(
              "h-9 w-9 text-sm font-medium transition-all duration-200",
              item.isActive
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "hover:bg-muted hover:text-foreground text-muted-foreground"
            )}
          >
            {item.page}
          </PaginationLink>
        </PaginationItem>
      );
    });
  };

  return (
    <div className="space-y-6">
    

      {/* Error State */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="text-destructive font-medium">Error loading products</div>
          <div className="text-destructive/80 text-sm mt-1">{error}</div>
          <button
            onClick={fetchProducts}
            className="mt-2 text-sm text-destructive hover:text-destructive/80 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Loading products...
          </div>
        </div>
      ) : (
        <ProductGrid products={products} onDelete={handleDelete} />
      )}
      
      {/* Pagination */}
      {paginationData && paginationData.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-background border border-border rounded-lg p-4 shadow-sm">
          <div className="text-sm text-muted-foreground order-2 sm:order-1">
            Showing <span className="font-medium text-foreground">
              {((currentPageFromURL - 1) * paginationData.limit) + 1}
            </span> to{' '}
            <span className="font-medium text-foreground">
              {Math.min(currentPageFromURL * paginationData.limit, paginationData.total)}
            </span> of{' '}
            <span className="font-medium text-foreground">
              {paginationData.total}
            </span> results
          </div>
          
          <Pagination className="order-1 sm:order-2">
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (paginationData.hasPrev) {
                      handlePageChange(currentPageFromURL - 1);
                    }
                  }}
                  className={cn(
                    "h-9 px-3 text-sm font-medium transition-all duration-200",
                    paginationData.hasPrev 
                      ? "hover:bg-muted hover:text-foreground text-muted-foreground" 
                      : "text-muted-foreground/50 cursor-not-allowed pointer-events-none"
                  )}
                />
              </PaginationItem>
              
              {renderPaginationItems()}
              
              <PaginationItem>  
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (paginationData.hasNext) {
                      handlePageChange(currentPageFromURL + 1);
                    }
                  }}
                  className={cn(
                    "h-9 px-3 text-sm font-medium transition-all duration-200",
                    paginationData.hasNext 
                      ? "hover:bg-muted hover:text-foreground text-muted-foreground" 
                      : "text-muted-foreground/50 cursor-not-allowed pointer-events-none"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}