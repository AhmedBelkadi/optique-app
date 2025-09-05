import { getCustomerById } from '@/features/customers/services/getCustomerById';
import CustomerForm from '@/components/features/customers/CustomerForm';
import { notFound } from 'next/navigation';
import { requirePermission } from '@/lib/auth/authorization';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface EditCustomerPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('customers', 'update');

  const { id } = await params;
  const result = await getCustomerById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Edit Customer</h1>
        <p className="text-muted-foreground mt-2">
          Update customer information and details.
        </p>
      </div>

      <CustomerForm mode="edit" customer={result.data} />
    </div>
  );
} 