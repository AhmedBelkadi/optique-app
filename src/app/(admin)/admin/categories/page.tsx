import { Suspense } from 'react';
import { getAllCategories } from '@/features/categories/services/getAllCategories';
import CategoriesClientWrapper from '@/components/features/categories/CategoriesClientWrapper';
import { Card, CardContent } from '@/components/ui/card';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import CategoriesSkeleton from '@/components/features/categories/CategoriesSkeleton';


export default async function CategoriesPage() {
  // Fetch categories
  const categoriesResult = await getAllCategories();
  const categories = categoriesResult.success ? categoriesResult.data || [] : [];

  return (
    <>
      <AdminPageConfig
        title="Categories"
        subtitle="Organize your products with custom categories"
        breadcrumbs={[
          { label: 'Categories', href: '/admin/categories' }
        ]}
        searchPlaceholder="Search categories by name..."
        showSearch={true}
        showNotifications={false} // Hide notifications for this page
      />

      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{categories.length}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Categories</p>
                  <p className="text-2xl font-bold text-slate-900">{categories.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">✓</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Categories</p>
                  <p className="text-2xl font-bold text-slate-900">{categories.filter(c => !c.isDeleted).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Content */}
        <Suspense fallback={<CategoriesSkeleton />}>
          <CategoriesClientWrapper categories={categories} />
        </Suspense>
      </div>
    </>
  );
} 