import TestimonialForm from '@/components/features/testimonials/TestimonialForm';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import { requirePermission } from '@/lib/auth/authorization';

export default async function NewTestimonialPage() {
  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('testimonials', 'create');

  return (
    <>
      <AdminPageConfig
        title="Create Testimonial"
        subtitle="Add a new customer testimonial"
        breadcrumbs={[
          { label: 'Testimonials', href: '/admin/testimonials' },
          { label: 'Create', href: '/admin/testimonials/new' }
        ]}
      />

      <div className="min-h-screen bg-muted/50">
        <div className="py-2">
          <TestimonialForm mode="create" />
        </div>
      </div>
    </>
  );
} 