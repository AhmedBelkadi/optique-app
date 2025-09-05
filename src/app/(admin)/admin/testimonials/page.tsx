import { Suspense } from 'react';
import { getAllTestimonialsAction } from '@/features/testimonials/actions/getAllTestimonialsAction';
import TestimonialsContainer from '@/components/features/testimonials/TestimonialsContainer';
import TestimonialsSkeleton from '@/components/features/testimonials/TestimonialsSkeleton';
import SyncButton from '@/components/features/testimonials/SyncButton';
import { Plus, Trash2 } from 'lucide-react';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { requirePermission } from '@/lib/auth/authorization';

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // optional, stricter

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
  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('testimonials', 'read');

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
  
  const result = await getAllTestimonialsAction({
    search,
    isActive,
    isDeleted,
    page: pageNum,
    limit: limitNum,
  });
  
  const testimonials = result.success ? (result as any).data || [] : [];
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

      <div className="min-h-screen bg-muted/50">
        <div className="py-4">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-2">
            <Link href="/admin/testimonials/new">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="w-4 h-4 mr-2" />
                Create Testimonial
              </Button>
            </Link>
            <Link href="/admin/testimonials/trash">
              <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4 mr-2" />
                Trash
              </Button>
            </Link>
            <SyncButton />
          </div>
          
          {/* Testimonials Content */}
          <Suspense fallback={<TestimonialsSkeleton />}>
            <TestimonialsContainer 
              initialTestimonials={testimonials} 
              pagination={pagination}
              currentPage={pageNum}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
} 