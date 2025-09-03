import { getSiteSettings } from '@/features/settings/services/siteSettings';
import { getOperationalSettings } from '@/features/settings/services/operationalSettings';
import { getContactSettings } from '@/features/settings/services/contactSettings';
import { getActiveBanner } from '@/features/banners/services/getActiveBanner';
import MaintenanceModeWrapper from '@/components/common/MaintenanceModeWrapper';
import PromotionalBanner from '@/components/common/PromotionalBanner';
import NavBar from '@/components/common/NavBar';
import Footer from '@/components/common/Footer';
import FloatingCTA from '@/components/features/home/FloatingCTA';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  // Fetch settings from separate services
  const [siteResult, operationalResult, contactResult] = await Promise.all([
    getSiteSettings(),
    getOperationalSettings(),
    getContactSettings(),
  ]);
  
  const siteSettings = siteResult.data;
  const contactSettings = contactResult.data;
  const maintenanceMode = operationalResult.data?.maintenanceMode || false;

  const bannerResult = await getActiveBanner();
  const activeBanner = bannerResult.success ? bannerResult.data : null;

  return (
    <MaintenanceModeWrapper
      siteName={siteSettings?.siteName}
      maintenanceMode={maintenanceMode} // pass the value here
    >
      {activeBanner && <PromotionalBanner message={activeBanner.text} />}
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer siteSettings={siteSettings} contactSettings={contactSettings} />
      <FloatingCTA />
    </MaintenanceModeWrapper>
  );
}
