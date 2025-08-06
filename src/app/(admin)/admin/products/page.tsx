
import { Suspense } from 'react';
import { getAllProducts } from '@/features/products/queries/getAllProducts';
import { getAllCategories } from '@/features/categories/services/getAllCategories';
import ProductsContainer from '@/components/features/products/ProductsContainer';
import ProductFilters from '@/components/features/products/ProductFilters';
import { Plus } from 'lucide-react';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import ProductsSkeleton from '@/components/features/products/ProductsSkeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    brand?: string;
    reference?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { 
    search, 
    category, 
    brand, 
    reference, 
    minPrice, 
    maxPrice, 
    sortBy, 
    sortOrder,
    page,
    limit
  } = await searchParams;
  
  // Fetch categories for the filter dropdown
  const categoriesResult = await getAllCategories();
  const categories = categoriesResult.success ? categoriesResult.data || [] : [];
  
  // Parse price filters
  const minPriceNum = minPrice ? parseFloat(minPrice) : undefined;
  const maxPriceNum = maxPrice ? parseFloat(maxPrice) : undefined;
  
  // Parse category filter (convert single category to array for new schema)
  const categoryIds = category ? [category] : undefined;
  
  // Parse pagination parameters
  const pageNum = page ? parseInt(page) : 1;
  const limitNum = limit ? parseInt(limit) : 12;
  
  const result = await getAllProducts({
    search,
    categoryIds,
    brand,
    reference,
    minPrice: minPriceNum,
    maxPrice: maxPriceNum,
    sortBy: sortBy as 'name' | 'price' | 'createdAt' | 'brand' || 'createdAt',
    sortOrder: sortOrder as 'asc' | 'desc' || 'desc',
    page: pageNum,
    limit: limitNum,
  });
  
  const products = result.success ? result.data || [] : [];
  const pagination = result.success ? result.pagination : undefined;

  return (
    <>
      <AdminPageConfig
        title="Products"
        subtitle="Manage your optical products and inventory"
        breadcrumbs={[
          { label: 'Products', href: '/admin/products' }
        ]}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="py-4">
          {/* Header Section */}
          <div className="flex mb-2">
            <Link href="/admin/products/new">
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="w-4 h-4 mr-2" />
                Create Product
              </Button>
            </Link>
          </div>
          
          {/* Products Content */}
          <Suspense fallback={<ProductsSkeleton />}>
            <div className="space-y-8">
              <ProductFilters categories={categories} />
              <ProductsContainer 
                initialProducts={products} 
                pagination={pagination}
                currentPage={pageNum}
              />
            </div>
          </Suspense>
        </div>
      </div>
    </>
  );
} 