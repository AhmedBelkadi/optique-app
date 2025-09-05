import { notFound } from 'next/navigation';
import { getProductById } from '@/features/products/queries/getProductById';
import ProductDetails from '@/components/features/products/ProductDetails';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import { requirePermission } from '@/lib/auth/authorization';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('products', 'read');

  const { id } = await params;
  const result = await getProductById(id);
  
  if (!result.success || !result.data) {
    notFound();
  }

  const product = result.data;

  return (
    <>
      <AdminPageConfig
        title="Product Details"
        subtitle="View and manage product information"
        breadcrumbs={[
          { label: 'Products', href: '/admin/products' },
          { label: 'Product Details', href: `/admin/products/${id}` }
        ]}
      />
      <ProductDetails product={product} />
    </>
  );
} 