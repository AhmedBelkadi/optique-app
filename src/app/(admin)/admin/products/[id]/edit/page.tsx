import { notFound } from 'next/navigation';
import { getProductById } from '@/features/products/queries/getProductById';
import ProductForm from '@/components/features/products/ProductForm';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import { requirePermission } from '@/lib/auth/authorization';
import { getAllCategoriesAction } from '@/features/categories/actions/getAllCategoriesAction';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('products', 'update');

  const { id } = await params;

  // Fetch product data
  const productResult = await getProductById(id);
  if (!productResult.success || !productResult.data) {
    notFound();
  }

  const product = productResult.data;

  // Fetch categories
  const categoriesResult = await getAllCategoriesAction();
  const categories = categoriesResult.success && categoriesResult.data ? categoriesResult.data : [];

  return (
    <>
      <AdminPageConfig
        title="Edit Product"
        subtitle={`Edit product: ${product.name}`}
        breadcrumbs={[
          { label: 'Products', href: '/admin/products' },
          { label: product.name, href: `/admin/products/${id}` },
          { label: 'Edit' }
        ]}
      />

      <div className="min-h-screen bg-muted/50">
        <div className="">
          <ProductForm 
            mode="edit" 
            categories={categories} 
            product={product}
          />
        </div>
      </div>
    </>
  );
} 