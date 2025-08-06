import TestimonialForm from '@/components/features/testimonials/TestimonialForm';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';

export default function NewTestimonialPage() {
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

      <div className="min-h-screen bg-gray-50">
        <div className="py-4">
          <TestimonialForm mode="create" />
        </div>
      </div>
    </>
  );
} 