import { getProductById } from '@/features/products/queries/getProductById';
import { getPublicProducts } from '@/features/products/services/getPublicProducts';

import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/ui/page-header';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { CTASection } from '@/components/ui/cta-section';
import { Suspense } from 'react';
import { ProductCard } from '@/components/ui/product-card';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { ProductDetailsSkeleton, ProductsGridSkeleton, PageHeaderSkeleton } from '@/components/ui/skeletons';
import { MobileProductGallery } from '@/components/features/products/MobileProductGallery';
import { MobileProductInfo } from '@/components/features/products/MobileProductInfo';
import { MobileRelatedProducts } from '@/components/features/products/MobileRelatedProducts';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface ProductDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function ProductDetailsContent({ params }: ProductDetailsPageProps) {
  const { id } = await params;
  const productResult = await getProductById(id);
  
  if (!productResult.success || !productResult.data) {
    notFound();
  }

  const product = productResult.data;

  // Fetch related products (same category)
  const relatedProductsResult = await getPublicProducts({
    categoryIds: product.categories.map(cat => cat.id),
    limit: 4,
  });

  const relatedProducts = relatedProductsResult.data?.filter(p => p.id !== product.id) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Produits', href: '/products' },
          { label: product.name }
        ]} 
      />

      {/* Page Header */}
      <div className="container mx-auto px-4 py-12">
        <PageHeader
          title={product.name}
          description={product.description || "Découvrez ce produit premium de notre collection"}
        />
      </div>

      {/* Product Details - Mobile Optimized */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
            {/* Product Images - Mobile Optimized */}
            <div className="space-y-4 md:space-y-6">
              <MobileProductGallery 
                images={product.images?.map(img => ({
                  id: img.id,
                  path: img.path,
                  alt: img.alt
                })) || []} 
                productName={product.name}
              />
            </div>

            {/* Product Information - Mobile Optimized */}
            <div className="space-y-6 md:space-y-8">
              <MobileProductInfo product={{
                ...product,
                reference: product.reference || undefined,
                brand: product.brand || undefined,
                createdAt: product.createdAt.toISOString()
              }} />
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 md:mb-4">
                Produits associés
              </h2>
              <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Découvrez d'autres produits de la même catégorie
              </p>
            </div>

            <Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Array.from({length:4}).map((_,i)=>(<div key={i} className="h-64 bg-muted rounded-lg animate-pulse"/>))}</div>}>
              {/* Desktop grid */}
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((relatedProduct, idx) => (
                  <div key={relatedProduct.id}>
                    <ProductCard product={relatedProduct} priorityImage={idx === 0} />
                  </div>
                ))}
              </div>

              {/* Mobile carousel like FeaturedProducts */}
              <MobileRelatedProducts products={relatedProducts} />
            </Suspense>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <CTASection
        variant="primary"
        title="Besoin d'aide pour choisir ?"
        description="Nos spécialistes optiques sont là pour vous aider à trouver les montures parfaites. Prenez rendez-vous aujourd'hui."
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

export default function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<ProductDetailsPageSkeleton />}>
        <ProductDetailsContent params={params} />
      </Suspense>
    </ErrorBoundary>
  );
}

function ProductDetailsPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="h-6 bg-muted rounded w-20 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-2 animate-pulse"></div>
          <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
        </div>
      </div>

      {/* Page Header */}
      <div className="container mx-auto px-4 py-12">
        <PageHeaderSkeleton />
      </div>

      {/* Product Details */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductDetailsSkeleton />
        </div>
      </section>

      {/* Related Products */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-muted rounded mb-4 animate-pulse max-w-48 mx-auto"></div>
            <div className="h-6 bg-muted rounded max-w-2xl mx-auto animate-pulse"></div>
          </div>
          <ProductsGridSkeleton count={4} />
        </div>
      </section>
    </div>
  );
}
