import { Suspense } from 'react';
import { getAllCustomersAction } from '@/features/customers/actions/getAllCustomersAction';
import CustomersContainer from '@/components/features/customers/CustomersContainer';
import CustomersSkeleton from '@/components/features/customers/CustomersSkeleton';
import { Plus, Trash2 } from 'lucide-react';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { requirePermission } from '@/lib/auth/authorization';

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // optional, stricter

interface CustomersPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('customers', 'read');

  const { 
    search, 
    status, 
    sortBy, 
    sortOrder,
    page,
    limit
  } = await searchParams;
  
  // Parse pagination parameters
  const pageNum = page ? parseInt(page) : 1;
  const limitNum = limit ? parseInt(limit) : 50;
  
  const result = await getAllCustomersAction({
    search,
    isDeleted: status === 'deleted',
    sortBy: sortBy as 'name' | 'email' | 'createdAt' | 'updatedAt' || 'createdAt',
    sortOrder: sortOrder as 'asc' | 'desc' || 'desc',
    page: pageNum,
    limit: limitNum,
  });

  const customers = result.success && result.data ? result.data : [];
  const pagination = result.success ? result.pagination : undefined;

  return (
    <>
      <AdminPageConfig
        title="Customers"
        subtitle="Manage your customer database and view customer information."
        breadcrumbs={[
          { label: 'Customers', href: '/admin/customers' }
        ]}
      />

      <div className="min-h-screen bg-muted/50">
        <div className="py-4">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-2">
            <Link href="/admin/customers/new">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="w-4 h-4 mr-2" />
                Create Customer
              </Button>
            </Link>
            <Link href="/admin/customers/trash">
              <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4 mr-2" />
                Trash
              </Button>
            </Link>
          </div>
          
          {/* Customers Content */}
          <Suspense fallback={<CustomersSkeleton />}>
            <CustomersContainer 
              initialCustomers={customers} 
              pagination={pagination}
              currentPage={pageNum}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
} 