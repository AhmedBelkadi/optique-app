import { getSettings } from '@/features/settings/services/getSettings';
import SettingsForm from '@/components/features/settings/SettingsForm';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';

export default async function SettingsPage() {
  const result = await getSettings();
  
  if (!result.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Settings</h1>
          <p className="text-gray-600">{result.error}</p>
        </div>
      </div>
    );
  }

  const settings = result.data!;

  return (
    <>
      <AdminPageConfig
        title="Site Settings"
        subtitle="Manage your site's appearance and contact information"
        breadcrumbs={[
          { label: 'Settings' } // No href for current page
        ]}
        showSearch={false}
        showNotifications={true}
      />

      <div className="min-h-screen bg-gray-50 p-6">
        <SettingsForm settings={settings} />
      </div>
    </>
  );
} 