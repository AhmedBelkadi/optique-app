'use client';

import { useState } from 'react';
import TestimonialTable from './TestimonialTable';
import { Testimonial } from '@/features/testimonials/schema/testimonialSchema';
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

interface TestimonialsContainerProps {
  initialTestimonials: Testimonial[];
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

export default function TestimonialsContainer({ 
  initialTestimonials, 
  pagination,
  currentPage 
}: TestimonialsContainerProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleDelete = (testimonialId: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== testimonialId));
  };

  const handleUpdate = (updatedTestimonial: Testimonial) => {
    setTestimonials((prev) => 
      prev.map((t) => t.id === updatedTestimonial.id ? updatedTestimonial : t)
    );
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/admin/testimonials?${params.toString()}`);
  };

    const renderPaginationItems = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const items = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

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
    if (endPage < pagination.totalPages) {
      if (endPage < pagination.totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={pagination.totalPages}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(pagination.totalPages);
            }}
          >
            {pagination.totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="space-y-6">
      {/* Testimonials Table */}
      {testimonials.length === 0 ? (
        <div className="bg-background rounded-lg border p-8 shadow-sm text-center">
          <div className="text-muted-foreground">
            <p className="text-lg font-medium mb-2">No testimonials found</p>
            <p className="text-sm">Get started by adding your first testimonial</p>
          </div>
        </div>
      ) : (
        <TestimonialTable testimonials={testimonials} onDelete={handleDelete} onUpdate={handleUpdate} />
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.hasPrev) {
                      handlePageChange(currentPage - 1);
                    }
                  }}
                  className={!pagination.hasPrev ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {renderPaginationItems()}
              
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.hasNext) {
                      handlePageChange(currentPage + 1);
                    }
                  }}
                  className={!pagination.hasNext ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
} 