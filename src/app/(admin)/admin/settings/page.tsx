import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import SettingsForm from '@/components/features/settings/SettingsForm';
import { getSiteSettings } from '@/features/settings/services/siteSettings';
import { getContactSettings } from '@/features/settings/services/contactSettings';
import { getOperationalSettings } from '@/features/settings/services/operationalSettings';
import { getThemeSettings } from '@/features/settings/services/themeSettings';
import { requirePermission } from '@/lib/auth/authorization';

export default async function ContentSettingsPage() {
  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('settings', 'read');

  try {
    // Fetch only the settings that are NOT already loaded in the root layout
    const [siteResult, contactResult, operationalResult, themeResult] = await Promise.all([
      getSiteSettings(),
      getContactSettings(),
      getOperationalSettings(),
      getThemeSettings()
    ]);

    // Check for errors
    const errors = [];
    if (!siteResult.success) errors.push(`Site Settings: ${siteResult.error}`);
    if (!contactResult.success) errors.push(`Contact Settings: ${contactResult.error}`);
    if (!operationalResult.success) errors.push(`Operational Settings: ${operationalResult.error}`);
    if (!themeResult.success) errors.push(`Theme Settings: ${themeResult.error}`);

    if (errors.length > 0) {
      console.error('Settings page errors:', errors);
      return (
        <div className="min-h-screen bg-muted/50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Error Loading Settings</h1>
            <p className="text-muted-foreground">Failed to load the following services:</p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-destructive">• {error}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    const siteSettings = siteResult.data!;
    const contactSettings = contactResult.data!;
    const operationalSettings = operationalResult.data!;
    const themeSettings = themeResult.data!;



    return (
      <>
        <AdminPageConfig
          title="Site Settings"
          subtitle="Manage your site's appearance, contact information, and configuration"
          breadcrumbs={[
            // { label: 'Content Management', href: '/admin/content' },
            { label: 'Site Settings' }
          ]}
          showSearch={false}
          showNotifications={true}
        />

        <div className="min-h-screen bg-background">
          <Suspense fallback={<SettingsSkeleton />}>
            <SettingsForm
              siteSettings={siteSettings}
              contactSettings={contactSettings}
              operationalSettings={operationalSettings}
              themeSettings={themeSettings}
            />
          </Suspense>
        </div>
      </>
    );
  } catch (error) {
    console.error('Settings page - unexpected error:', error);
    return (
      <div className="min-h-screen bg-muted/50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-foreground text-2xl font-bold mb-2">Unexpected Error</h1>
          <p className="text-muted-foreground">An unexpected error occurred while loading the settings page.</p>
          <pre className="text-sm text-destructive mt-2 bg-muted p-2 rounded">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      </div>
    );
  }
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
      
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}
