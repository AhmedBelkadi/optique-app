
import { getAllCategoriesAction } from '@/features/categories/actions/getAllCategoriesAction';
import ProductForm from '@/components/features/products/ProductForm';
import { requirePermission } from '@/lib/auth/authorization';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';

export default async function NewProductPage() {
  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('products', 'create');

  const result = await getAllCategoriesAction();
  const categories = result.success ? result.data || [] : [];

  return (
    <>
      <AdminPageConfig
        title="Add New Product"
        subtitle="Create a new product for your inventory"
        breadcrumbs={[
          { label: 'Products', href: '/admin/products' },
          { label: 'Add New Product' } // No href for current page
        ]}
        
        showSearch={false} // Hide search for form pages
        showNotifications={true}
      />

      <div className="min-h-screen bg-muted/50">
          <ProductForm mode="create" categories={categories} />
      </div>
    </>
  );
} 