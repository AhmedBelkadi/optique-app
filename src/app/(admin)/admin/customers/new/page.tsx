import CustomerForm from '@/components/features/customers/CustomerForm';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import { requirePermission } from '@/lib/auth/authorization';

export default async function NewCustomerPage() {
  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('customers', 'create');

  return (
    <div className="space-y-6">
      <AdminPageConfig
        title="New Customer"
        subtitle="Create a new customer"
        breadcrumbs={[
          { label: 'Customers', href: '/admin/customers' },
          { label: 'New Customer', href: '/admin/customers/new' }
        ]}
      />

      <CustomerForm mode="create" />
    </div>
  );
} 