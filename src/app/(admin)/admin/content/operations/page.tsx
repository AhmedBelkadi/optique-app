import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import OperationsSettingsForm from '@/components/features/settings/OperationsSettingsForm';
import ExternalAPIKeysForm from '@/components/features/settings/ExternalAPIKeysForm';
import { getOperationalSettingsAction } from '@/features/operations/actions/getOperationalSettingsAction';
import { getExternalAPISettingsAction } from '@/features/settings/actions/getExternalAPISettingsAction';
import { requirePermission } from '@/lib/auth/authorization';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // optional, stricter

export default async function ContentOperationsPage() {

  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('operations', 'read');

  const [operationalResult, externalAPIResult] = await Promise.all([
    getOperationalSettingsAction(),
    getExternalAPISettingsAction()
  ]);
  
  if (!operationalResult.success) {
    return (
      <div className="min-h-screen bg-muted/50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Error Loading Operations Settings</h1>
          <p className="text-muted-foreground">{operationalResult.error}</p>
        </div>
      </div>
    );
  }

  const operationalSettings = operationalResult.data!;
  
  // Get external API settings from database
  let externalAPISettings = {
    googlePlacesApiKey: '',
    googlePlaceId: '',
    facebookAccessToken: '',
    facebookPageId: '',
    enableGoogleSync: false,
    enableFacebookSync: false,
  };

  if (externalAPIResult.success && externalAPIResult.data) {
    externalAPISettings = {
      googlePlacesApiKey: externalAPIResult.data.googlePlacesApiKey || '',
      googlePlaceId: externalAPIResult.data.googlePlaceId || '',
      facebookAccessToken: externalAPIResult.data.facebookAccessToken || '',
      facebookPageId: externalAPIResult.data.facebookPageId || '',
      enableGoogleSync: externalAPIResult.data.enableGoogleSync || false,
      enableFacebookSync: externalAPIResult.data.enableFacebookSync || false,
    };
  }

  return (
    <>
      <AdminPageConfig
        title="Paramètres opérationnels"
        subtitle="Gérez la configuration opérationnelle de votre site et les intégrations API externes"
        breadcrumbs={[
          { label: 'Gestion du contenu', href: '/admin/content' },
          { label: 'Paramètres opérationnels' }
        ]}
        showSearch={false}
        showNotifications={true}
      />

      <div className="px-4 sm:px-6 py-4 min-h-screen space-y-6">

        <Tabs defaultValue="operations" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 border border-border ">
            <TabsTrigger className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200" value="operations">Paramètres opérationnels</TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200" value="external-apis">API externes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="operations" className="space-y-6">
            <Suspense fallback={<OperationsSettingsSkeleton />}>
              <OperationsSettingsForm settings={operationalSettings as any} />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="external-apis" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Configuration des API externes</h2>
                <p className="text-muted-foreground">
                  Configurez les clés API pour synchroniser automatiquement les avis Google et Facebook
                </p>
              </div>
              
              <ExternalAPIKeysForm initialSettings={externalAPISettings} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function OperationsSettingsSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
      
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}


