import { getAllServicesAction } from '@/features/services/actions/getAllServicesAction';
import { requirePermission } from '@/lib/auth/authorization';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import ServicesClient from '@/components/features/services/ServicesClient';

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // optional, stricter

export default async function ServicesPage() {
  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('services', 'read');

  // Fetch services
  const servicesResult = await getAllServicesAction();
  const services = servicesResult.success && servicesResult.data ? servicesResult.data : [];
  

  return (
    <div className="">
      <AdminPageConfig
        title="Services"
        subtitle="Gérez les services affichés dans le footer et sur la page de rendez-vous"
        breadcrumbs={[
          { label: 'Services', href: '/admin/services' }
        ]}
      />
      <ServicesClient services={services} />
    </div>
  );
}
