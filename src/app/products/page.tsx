import Link from 'next/link';
import { getAllProducts } from '@/features/products/queries/getAllProducts';
import { getAllCategories } from '@/features/categories/services/getAllCategories';
import ProductsContainer from '@/components/features/products/ProductsContainer';
import ProductFilters from '@/components/features/products/ProductFilters';

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <div className="flex space-x-4">
            <Link
              href="/products/trash"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              View Trash
            </Link>
            <Link
              href="/products/new"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Add New Product
            </Link>
          </div>
        </div>
        
        <ProductFilters categories={categories} />
        <ProductsContainer 
          initialProducts={products} 
          pagination={pagination}
          currentPage={pageNum}
        />
      </div>
    </div>
  );
} 