import Link from 'next/link';
import { getDeletedProducts } from '@/features/products/queries/getDeletedProducts';
import DeletedProductsContainer from '@/components/features/products/DeletedProductsContainer';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';

export default async function TrashPage() {
  const result = await getDeletedProducts();
  const deletedProducts = result.success ? result.data || [] : [];

  return (
    <>
      <AdminPageConfig
        title="Trash"
        subtitle="Deleted products that can be restored"
        breadcrumbs={[
          { label: 'Products', href: '/admin/products' },
          { label: 'Trash' } // No href for current page
        ]}

        showSearch={false} // Hide search for trash page
        showNotifications={true}
      />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {deletedProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🗑️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No deleted products</h3>
              <p className="text-gray-500">Deleted products will appear here and can be restored.</p>
            </div>
          ) : (
            <DeletedProductsContainer initialDeletedProducts={deletedProducts} />
          )}
        </div>
      </div>
    </>
  );
} 