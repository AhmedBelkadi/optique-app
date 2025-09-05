import { getAllTestimonialsAction } from '@/features/testimonials/actions/getAllTestimonialsAction';
import DeletedTestimonialsContainer from '@/components/features/testimonials/DeletedTestimonialsContainer';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import { requirePermission } from '@/lib/auth/authorization';

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // optional, stricter

export default async function TrashPage() {
  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('testimonials', 'read');

  const result = await getAllTestimonialsAction({
    isDeleted: true,
    page: 1,
    limit: 50,
  });
  
  const deletedTestimonials = result.success ? (result as any).data || [] : [];

  return (
    <>
      <AdminPageConfig
        title="Trash"
        subtitle="Deleted testimonials that can be restored"
        breadcrumbs={[
          { label: 'Testimonials', href: '/admin/testimonials' },
          { label: 'Trash' } // No href for current page
        ]}
        showSearch={false} // Hide search for trash page
        showNotifications={true}
      />

      <div className="min-h-screen bg-muted/50">
        <div className="">
          {deletedTestimonials.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground/60 text-6xl mb-4">🗑️</div>
              <h3 className="text-lg font-medium text-foreground mb-2">No deleted testimonials</h3>
              <p className="text-muted-foreground">Deleted testimonials will appear here and can be restored.</p>
            </div>
          ) : (
            <DeletedTestimonialsContainer initialDeletedTestimonials={deletedTestimonials} />
          )}
        </div>
      </div>
    </>
  );
}
