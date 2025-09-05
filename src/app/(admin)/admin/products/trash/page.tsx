import Link from 'next/link';
import { getDeletedProducts } from '@/features/products/queries/getDeletedProducts';
import DeletedProductsContainer from '@/components/features/products/DeletedProductsContainer';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import { requirePermission } from '@/lib/auth/authorization';

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // optional, stricter

export default async function TrashPage() {
  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('products', 'read');

  const result = await getDeletedProducts();
  const deletedProducts = result.success ? (result as any).data || [] : [];

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

      <div className="min-h-screen bg-muted/50 py-8">
        <div className="">
          {deletedProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground/60 text-6xl mb-4">🗑️</div>
              <h3 className="text-lg font-medium text-foreground mb-2">No deleted products</h3>
              <p className="text-muted-foreground">Deleted products will appear here and can be restored.</p>
            </div>
          ) : (
            <DeletedProductsContainer initialDeletedProducts={deletedProducts} />
          )}
        </div>
      </div>
    </>
  );
} 