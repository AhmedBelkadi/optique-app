import { getCustomerById } from '@/features/customers/services/getCustomerById';
import CustomerForm from '@/components/features/customers/CustomerForm';
import { notFound } from 'next/navigation';

interface EditCustomerPageProps {
  params: {
    id: string;
  };
}

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
  const result = await getCustomerById(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Customer</h1>
        <p className="text-gray-600 mt-2">
          Update customer information and details.
        </p>
      </div>

      <CustomerForm mode="edit" customer={result.data} />
    </div>
  );
} 