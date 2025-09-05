import { Suspense } from 'react';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import FAQPageManager from '@/components/features/cms/FAQPageManager';
import FAQPageSkeleton from '@/components/features/cms/FAQPageSkeleton';
import { getAllFAQsAction } from '@/features/faqs/actions/getAllFAQsAction';
import { requirePermission } from '@/lib/auth/authorization';

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // optional, stricter

export default async function ContentFAQPage() {

  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('faqs', 'read');

  // Fetch all FAQs
  const faqsResult = await getAllFAQsAction();
  const faqs = faqsResult.success ? (faqsResult as any).data || [] : [];

  return (
    <>
      <AdminPageConfig
        title="FAQ Page Management"
        subtitle="Manage FAQ entries and questions"
        breadcrumbs={[
          { label: 'Content Management', href: '/admin/content' },
          { label: 'FAQ Page' }
        ]}
        showSearch={false}
        showNotifications={true}
      />

      <div className="space-y-6">
        <Suspense fallback={<FAQPageSkeleton />}>
          <FAQPageManager
            faqs={faqs}
          />
        </Suspense>
      </div>
    </>
  );
}
