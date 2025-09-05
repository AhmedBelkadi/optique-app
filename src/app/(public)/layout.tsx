import { getSiteSettings } from '@/features/settings/services/siteSettings';
import { getOperationalSettings } from '@/features/settings/services/operationalSettings';
import { getContactSettings } from '@/features/settings/services/contactSettings';
import { getActiveBanner } from '@/features/banners/services/getActiveBanner';
import { getPublicServices } from '@/features/services/services/getPublicServices';
import MaintenanceModeWrapper from '@/components/common/MaintenanceModeWrapper';
import PromotionalBanner from '@/components/common/PromotionalBanner';
import NavBar from '@/components/common/NavBar';
import Footer from '@/components/common/Footer';
import FloatingCTA from '@/components/features/home/FloatingCTA';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  // Fetch settings from separate services
  const [siteResult, operationalResult, contactResult, servicesResult] = await Promise.all([
    getSiteSettings(),
    getOperationalSettings(),
    getContactSettings(),
    getPublicServices(),
  ]);
  
  const siteSettings = siteResult.data;
  const contactSettings = contactResult.data;
  const maintenanceMode = operationalResult.data?.maintenanceMode || false;
  const services = servicesResult.success && servicesResult.data ? servicesResult.data : [];

  const bannerResult = await getActiveBanner();
  const activeBanner = bannerResult.success ? bannerResult.data : null;

  return (
    <MaintenanceModeWrapper
      siteName={siteSettings?.siteName || undefined}
      maintenanceMode={maintenanceMode} // pass the value here
    >
      {activeBanner && <PromotionalBanner message={activeBanner.text} />}
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer siteSettings={siteSettings ? {
        siteName: siteSettings.siteName || undefined,
        slogan: siteSettings.slogan || undefined
      } : undefined} contactSettings={contactSettings} services={services} />
      <FloatingCTA />
    </MaintenanceModeWrapper>
  );
}
