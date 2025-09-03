import { Suspense } from 'react';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import AboutPageManager from '@/components/features/cms/AboutPageManager';
import AboutPageSkeleton from '@/components/features/cms/AboutPageSkeleton';
import { getAllAboutSectionsAction } from '@/features/about/actions/getAllAboutSectionsAction';
import { getAboutBenefitsAction } from '@/features/about/actions/getAboutBenefitsAction';
import { requirePermission } from '@/lib/auth/authorization';


export default async function ContentAboutPage() {

  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('about', 'read');

  const [aboutSectionsResult, aboutBenefitsResult] = await Promise.all([
    getAllAboutSectionsAction(),
    getAboutBenefitsAction()
  ]);

  const aboutSections = aboutSectionsResult.success ? aboutSectionsResult.data || [] : [];
  const benefits = aboutBenefitsResult.success ? aboutBenefitsResult.data || [] : [];

  return (
    <>
      <AdminPageConfig
        title="Page À Propos"
        subtitle="Gérez les sections de contenu et les avantages de la page À Propos"
        breadcrumbs={[
          { label: 'Contenu CMS', href: '/admin/content' },
          { label: 'Page À Propos' }
        ]}
        showSearch={false}
        showNotifications={true}
      />

      <div className="space-y-6">
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

