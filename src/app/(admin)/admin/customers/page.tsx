import { getAllCustomersAction } from '@/features/customers/actions/getAllCustomersAction';
import CustomersContainer from '@/components/features/customers/CustomersContainer';

export default async function CustomersPage() {
  const result = await getAllCustomersAction({
    isDeleted: false,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 50,
  });

  const customers = result.success ? result.data : [];
  const pagination = result.success ? result.pagination : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-2">
          Manage your customer database and view customer information.
        </p>
      </div>

      <CustomersContainer 
        initialCustomers={customers} 
        pagination={pagination}
      />
    </div>
  );
} 