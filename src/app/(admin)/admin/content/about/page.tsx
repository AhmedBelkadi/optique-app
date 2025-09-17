import { Suspense } from 'react';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import AboutPageManager from '@/components/features/about/AboutPageManager';
import AboutPageSkeleton from '@/components/features/about/AboutPageSkeleton';
import { getAllAboutSectionsAction } from '@/features/about/actions/getAllAboutSectionsAction';
import { getAboutBenefitsAction } from '@/features/about/actions/getAboutBenefitsAction';
import { requirePermission } from '@/lib/auth/authorization';

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // optional, stricter

export default async function ContentAboutPage() {

  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('about', 'read');

  const [aboutSectionsResult, aboutBenefitsResult] = await Promise.all([
    getAllAboutSectionsAction(),
    getAboutBenefitsAction()
  ]);

  const aboutSections = aboutSectionsResult.success ? (aboutSectionsResult as any).data || [] : [];
  const benefits = aboutBenefitsResult.success ? (aboutBenefitsResult as any).data || [] : [];

  return (
    <>
      <AdminPageConfig
        title="Page À Propos"
        subtitle="Gérez les sections de contenu et les avantages de la page À Propos"
        breadcrumbs={[
          { label: 'Contenu CMS', href: '/admin/content' },
          { label: 'Page À Propos' }
        ]}

      />

      <div className="px-4 sm:px-6 py-4 space-y-6">
        <Suspense fallback={<AboutPageSkeleton />}>
          <AboutPageManager
            aboutSections={aboutSections}
            benefits={benefits}
          />
        </Suspense>
      </div>
    </>
  );
}

