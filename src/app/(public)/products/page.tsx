import { getPublicProducts } from '@/features/products/services/getPublicProducts';
import { getPublicCategories } from '@/features/categories/services/getPublicCategories';
import { PageHeader } from '@/components/ui/page-header';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { CTASection } from '@/components/ui/cta-section';
import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { PageHeaderSkeleton } from '@/components/ui/skeletons';
import { ProductsPageClient } from '@/components/features/products/ProductsPageClient';

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // optional, stricter

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    priceRange?: string;
    page?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

async function ProductsContent({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const search = params.search || '';
  const category = params.category || '';
  const priceRange = params.priceRange || '';
  const page = parseInt(params.page || '1');
  const sortBy = (params.sortBy as 'name' | 'price' | 'createdAt') || 'createdAt';
  const sortOrder = (params.sortOrder as 'asc' | 'desc') || 'desc';

  // Parse price range
  let minPrice: number | undefined;
  let maxPrice: number | undefined;
  if (priceRange === 'budget') {
    maxPrice = 100;
  } else if (priceRange === 'mid') {
    minPrice = 100;
    maxPrice = 300;
  } else if (priceRange === 'premium') {
    minPrice = 300;
  }

  // Fetch products and categories data
  const [productsResult, categoriesResult] = await Promise.all([
    getPublicProducts({
      search,
      categoryIds: category && category !== 'all' ? [category] : undefined,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      page,
      limit: 12,
    }),
    getPublicCategories(),
  ]);

  const products = productsResult.data || [];
  const categories = categoriesResult.data || [];
  const pagination = productsResult.pagination;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Produits', href: '/products' }
        ]} 
      />

      {/* Page Header */}
      <div className="container mx-auto px-4 py-12">
        <PageHeader
          title="Notre Catalogue de Produits"
          description="Découvrez notre sélection premium de lunettes, montures et accessoires optiques. Trouvez le style parfait qui correspond à votre personnalité et à vos besoins visuels."
        />
      </div>

      {/* Products Page Client Component - Handles all filtering, search, and display */}
      <ProductsPageClient
        products={products as any}
        categories={categories}
        pagination={pagination || { page: 1, totalPages: 1, total: 0 }}
        searchParams={params}
      />

      {/* CTA Section */}
      <CTASection
        variant="primary"
        title="Besoin d'aide pour choisir ?"
        description="Nos spécialistes optiques sont là pour vous conseiller. Prenez rendez-vous aujourd'hui."
        primaryAction={{
          label: "Prendre Rendez-vous",
          href: "/appointment"
        }}
        secondaryAction={{
          label: "Voir Tous les Produits",
          href: "/products"
        }}
      />
    </div>
  );
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<ProductsPageSkeleton />}>
        <ProductsContent searchParams={searchParams} />
      </Suspense>
    </ErrorBoundary>
  );
}

function ProductsPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
      </div>

      {/* Page Header */}
      <div className="container mx-auto px-4 py-12">
        <PageHeaderSkeleton />
      </div>

      {/* Filters and Search */}
      <section className="py-8 lg:py-12 bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="h-12 bg-muted rounded animate-pulse"></div>
              <div className="h-12 bg-muted rounded w-48 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-11 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-80 bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 