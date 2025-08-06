
import ProductForm from '@/components/features/products/ProductForm';
import { getAllCategories } from '@/features/categories/services/getAllCategories';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';

export default async function NewProductPage() {
  
  const result = await getAllCategories();
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

      <div className="min-h-screen bg-gray-50">
          <ProductForm mode="create" categories={categories} />
      </div>
    </>
  );
} 