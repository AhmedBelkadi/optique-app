import Link from 'next/link';
import { getDeletedProducts } from '@/features/products/queries/getDeletedProducts';
import DeletedProductsContainer from '../../../components/features/products/DeletedProductsContainer';

export default async function TrashPage() {
  const result = await getDeletedProducts();
  const deletedProducts = result.success ? result.data || [] : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trash</h1>
            <p className="text-gray-600 mt-2">Deleted products that can be restored</p>
          </div>
          <Link
            href="/products"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Back to Products
          </Link>
        </div>
        
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
  );
} 