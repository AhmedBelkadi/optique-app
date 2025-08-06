import CustomerForm from '@/components/features/customers/CustomerForm';

export default function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Customer</h1>
        <p className="text-gray-600 mt-2">
          Create a new customer record in your database.
        </p>
      </div>

      <CustomerForm mode="create" />
    </div>
  );
} 