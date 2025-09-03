import { notFound } from 'next/navigation';
import { getTestimonialById } from '@/features/testimonials/queries/getTestimonialById';
import TestimonialForm from '@/components/features/testimonials/TestimonialForm';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import { requirePermission } from '@/lib/auth/authorization';

interface EditTestimonialPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTestimonialPage({ params }: EditTestimonialPageProps) {
  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('testimonials', 'update');

  const { id } = await params;
  
  const result = await getTestimonialById(id);
  
  if (!result.success || !result.data) {
    notFound();
  }

  const testimonial = result.data;

  return (
    <>
      <AdminPageConfig
        title="Edit Testimonial"
        subtitle={`Edit testimonial from ${testimonial.name}`}
        breadcrumbs={[
          { label: 'Testimonials', href: '/admin/testimonials' },
          { label: testimonial.name, href: `/admin/testimonials/${id}` },
          { label: 'Edit', href: `/admin/testimonials/${id}/edit` }
        ]}
      />

      <div className="min-h-screen bg-muted/50">
        <div className="py-4">
          <TestimonialForm mode="edit" testimonial={testimonial} />
        </div>
      </div>
    </>
  );
} 