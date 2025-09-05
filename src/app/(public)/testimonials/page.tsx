import { getPublicTestimonials } from '@/features/testimonials/services/getPublicTestimonials';
import { getSiteSettings } from '@/features/settings/services/siteSettings';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Quote, Users, User, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import Image from 'next/image';
import { PageHeader } from '@/components/ui/page-header';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { TestimonialsGridSkeleton, PageHeaderSkeleton } from '@/components/ui/skeletons';
import { MobileTestimonialsGrid } from '@/components/features/testimonials/MobileTestimonialsGrid';

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // optional, stricter

interface TestimonialsPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

async function TestimonialsContent({ searchParams }: TestimonialsPageProps) {
  const params = await searchParams;
  const search = params.search || '';
  const page = parseInt(params.page || '1');
  
  // Fetch testimonials and site settings
  const [testimonialsResult, siteSettingsResult] = await Promise.all([
    getPublicTestimonials({
      search,
      page,
      limit: 12,
    }),
    getSiteSettings()
  ]);

  const testimonials = (testimonialsResult.data || []) as any[];
  const pagination = testimonialsResult.pagination;
  const siteSettings = siteSettingsResult.success ? siteSettingsResult.data : null;

  // Calculate average rating from actual testimonial ratings
  const averageRating = testimonials.length > 0 
    ? testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / testimonials.length 
    : 5;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Témoignages', href: '/testimonials' }
        ]} 
      />

      {/* Page Header */}
      <div className="container mx-auto px-4 py-16">
        <PageHeader
          title="Ils nous font confiance"
          description={`Découvrez ce que nos clients disent de leur expérience chez ${siteSettings?.siteName || 'nous'}. Des témoignages authentiques de nos clients satisfaits.`}
        >
          {/* Rating Summary */}
          {testimonials.length > 0 && (
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${i < Math.floor(averageRating) ? "text-warning fill-current" : "text-muted"}`}
                  />
                ))}
              </div>
              <span className="text-2xl font-bold text-foreground">{averageRating.toFixed(1)}</span>
              <span className="text-muted-foreground">({testimonials.length} avis)</span>
            </div>
          )}
        </PageHeader>

        {/* Mobile-Optimized Testimonials Grid - Only on Mobile */}
        <div className="md:hidden max-w-7xl mx-auto px-4">
          <MobileTestimonialsGrid 
            testimonials={testimonials} 
            pagination={pagination || { page: 1, totalPages: 1, total: 0 }}
            searchParams={params}
          />
        </div>

        {/* Desktop Testimonials Grid - Original Layout */}
        <div className="hidden md:block max-w-7xl mx-auto px-4">
          {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Rechercher un témoignage..."
                    className="pl-10"
                    defaultValue={search}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select defaultValue={page.toString()}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Page" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: pagination?.totalPages || 1 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        Page {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.rating ? "text-warning fill-current" : "text-muted"}`}
                      />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground mb-4 italic">
                    "{testimonial.message}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(testimonial.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {(pagination?.totalPages || 1) > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                asChild
              >
                <a href={`/testimonials?${new URLSearchParams({
                  ...(search && { search }),
                  page: (page - 1).toString()
                })}`}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Précédent
                </a>
              </Button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, pagination?.totalPages || 1) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      asChild
                    >
                      <a href={`/testimonials?${new URLSearchParams({
                        ...(search && { search }),
                        page: pageNum.toString()
                      })}`}>
                        {pageNum}
                      </a>
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={page === (pagination?.totalPages || 1)}
                asChild
              >
                <a href={`/testimonials?${new URLSearchParams({
                  ...(search && { search }),
                  page: (page + 1).toString()
                })}`}>
                  Suivant
                  <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsPage({ searchParams }: TestimonialsPageProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<TestimonialsPageSkeleton />}>
        <TestimonialsContent searchParams={searchParams} />
      </Suspense>
    </ErrorBoundary>
  );
}

function TestimonialsPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="h-6 bg-muted rounded w-24 animate-pulse"></div>
      </div>

      {/* Page Header */}
      <div className="container mx-auto px-4 py-16">
        <PageHeaderSkeleton />
      </div>

      {/* Testimonials Grid */}
      <div className="container mx-auto px-4 py-8">
        <TestimonialsGridSkeleton count={12} />
      </div>
    </div>
  );
} 