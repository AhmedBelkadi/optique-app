import { notFound } from 'next/navigation';
import { getProductById } from '@/features/products/queries/getProductById';
import { getAllCategories } from '@/features/categories/services/getAllCategories';
import ProductForm from '@/components/features/products/ProductForm';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = params;

  // Fetch product data
  const productResult = await getProductById(id);
  if (!productResult.success || !productResult.data) {
    notFound();
  }

  const product = productResult.data;

  // Fetch categories
  const categoriesResult = await getAllCategories();
  const categories = categoriesResult.success ? categoriesResult.data || [] : [];

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

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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