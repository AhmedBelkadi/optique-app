'use client';

import { useState, useEffect } from 'react';
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

interface ProductsContainerProps {
  initialProducts: Product[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  currentPage: number;
}

export default function ProductsContainer({ 
  initialProducts, 
  pagination,
  currentPage 
}: ProductsContainerProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [currentPagination, setCurrentPagination] = useState(pagination);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Refetch products when search params change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const filters = {
          search: searchParams.get('search') || undefined,
          categoryIds: searchParams.get('category') ? [searchParams.get('category')!] : undefined,
          brand: searchParams.get('brand') || undefined,
          reference: searchParams.get('reference') || undefined,
          minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
          maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
          sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
          sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
          page: parseInt(searchParams.get('page') || '1'),
          limit: 12
        };

        const result = await getAllProductsAction(filters);
        if (result.success && result.data) {
          setProducts(result.data);
          setCurrentPagination(result.pagination);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const handleDelete = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/admin/products?${params.toString()}`);
  };

  const renderPaginationItems = () => {
    if (!currentPagination || currentPagination.totalPages <= 1) return null;

    const items = [];
    const maxVisiblePages = 5;
    
    // Fixed: Use let instead of const for variables that need to be reassigned
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(currentPagination.totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(1);
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Visible pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={i === currentPage}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Last page
    if (endPage < currentPagination.totalPages) {
      if (endPage < currentPagination.totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={currentPagination.totalPages}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPagination.totalPages);
            }}
          >
            {currentPagination.totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-muted-foreground">Loading products...</div>
        </div>
      ) : (
        <ProductGrid products={products} onDelete={handleDelete} />
      )}
      
      {/* Pagination */}
      {currentPagination && currentPagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-foreground">
            Showing {((currentPage - 1) * currentPagination.limit) + 1} to{' '}
            {Math.min(currentPage * currentPagination.limit, currentPagination.total)} of{' '}
            {currentPagination.total} results
          </div>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPagination.hasPrev) {
                      handlePageChange(currentPage - 1);
                    }
                  }}
                  className={!currentPagination.hasPrev ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {renderPaginationItems()}
              
              <PaginationItem>  
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPagination.hasNext) {
                      handlePageChange(currentPage + 1);
                    }
                  }}
                  className={!currentPagination.hasNext ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}