
import { Suspense } from 'react';
import { getAllProductsAction } from '@/features/products/actions/getAllProductsAction';
import { getAllCategoriesAction } from '@/features/categories/actions/getAllCategoriesAction';
import ProductsContainer from '@/components/features/products/ProductsContainer';
import ProductFilters from '@/components/features/products/ProductFilters';
import { Plus, Trash2 } from 'lucide-react';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import ProductsSkeleton from '@/components/features/products/ProductsSkeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { requirePermission } from '@/lib/auth/authorization';

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // optional, stricter

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
  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('products', 'read');

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
  const categoriesResult = await getAllCategoriesAction();
  const categories = categoriesResult.success && categoriesResult.data ? categoriesResult.data : [];
  
  // Parse price filters
  const minPriceNum = minPrice ? parseFloat(minPrice) : undefined;
  const maxPriceNum = maxPrice ? parseFloat(maxPrice) : undefined;
  
  // Parse category filter (convert single category to array for new schema)
  const categoryIds = category ? [category] : undefined;
  
  // Parse pagination parameters
  const pageNum = page ? parseInt(page) : 1;
  const limitNum = limit ? parseInt(limit) : 12;
  
  const result = await getAllProductsAction({
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
  
  const products = result.success && result.data ? result.data : [];
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

      <div className="min-h-screen bg-muted/50">
        <div className="py-4">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-2">
            <Link href="/admin/products/new">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="w-4 h-4 mr-2" />
                Create Product
              </Button>
            </Link>
            <Link href="/admin/products/trash">
              <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4 mr-2" />
                Trash
              </Button>
            </Link>
          </div>
          
          {/* Products Content */}
          <Suspense fallback={<ProductsSkeleton />}>
            <div className="space-y-4">
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