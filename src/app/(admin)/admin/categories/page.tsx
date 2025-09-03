import { getAllCategoriesAction } from '@/features/categories/actions/getAllCategoriesAction';
import { requirePermission } from '@/lib/auth/authorization';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import CategoriesClient from '@/components/features/categories/CategoriesClient';

export default async function CategoriesPage() {
  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('categories', 'read');

  // Fetch categories
  const categoriesResult = await getAllCategoriesAction();
  const categories = categoriesResult.success ? categoriesResult.data || [] : [];

  return (
    <div className="">
        <AdminPageConfig
        title="Catégories"
        subtitle="Manager vos catégories et afficher les informations de vos catégories."
        breadcrumbs={[
          { label: 'Catégories', href: '/admin/categories' }
        ]}
      />
      <CategoriesClient categories={categories} />
    </div>
  );
} 