import { Suspense } from 'react';
import { getAllTestimonials } from '@/features/testimonials/queries/getAllTestimonials';
import TestimonialsContainer from '@/components/features/testimonials/TestimonialsContainer';
import TestimonialsSkeleton from '@/components/features/testimonials/TestimonialsSkeleton';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';

interface TestimonialsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function TestimonialsPage({ searchParams }: TestimonialsPageProps) {
  const { 
    search, 
    status, 
    sortBy, 
    sortOrder,
    page,
    limit
  } = await searchParams;
  
  // Parse status filter
  let isActive: boolean | undefined;
  let isDeleted = false;
  
  if (status === 'active') {
    isActive = true;
  } else if (status === 'hidden') {
    isActive = false;
  } else if (status === 'deleted') {
    isDeleted = true;
  }
  
  // Parse pagination parameters
  const pageNum = page ? parseInt(page) : 1;
  const limitNum = limit ? parseInt(limit) : 50;
  
  const result = await getAllTestimonials({
    search,
    isActive,
    isDeleted,
    sortBy: sortBy as 'name' | 'createdAt' | 'updatedAt' || 'createdAt',
    sortOrder: sortOrder as 'asc' | 'desc' || 'desc',
    page: pageNum,
    limit: limitNum,
  });
  
  const testimonials = result.success ? result.data || [] : [];
  const pagination = result.success ? result.pagination : undefined;

  return (
    <>
      <AdminPageConfig
        title="Testimonials"
        subtitle="Manage customer testimonials and reviews"
        breadcrumbs={[
          { label: 'Testimonials', href: '/admin/testimonials' }
        ]}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="py-4">
          <Suspense fallback={<TestimonialsSkeleton />}>
            <TestimonialsContainer 
              initialTestimonials={testimonials} 
              pagination={pagination}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
} 