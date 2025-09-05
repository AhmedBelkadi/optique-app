import { getAllFAQs } from '@/features/faqs/services/getAllFAQs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronDown, 
  Glasses, 
  Phone 
} from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/page-header';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { CTASection } from '@/components/ui/cta-section';
import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { FAQListSkeleton, PageHeaderSkeleton } from '@/components/ui/skeletons';
import { EmptyState } from '@/components/ui/error-boundary';
import { MobileFAQAccordion } from '@/components/features/faq/MobileFAQAccordion';

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // optional, stricter

async function FAQContent() {
  // Fetch all FAQs
  const faqsResult = await getAllFAQs();
  const faqs = faqsResult.success && faqsResult.data ? faqsResult.data : [];

  // Create a simple category for all FAQs
  const categories = [
    { name: "Tous", icon: "glasses", count: faqs.length }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'FAQ', href: '/faq' }
        ]} 
      />

      {/* Page Header */}
      <div className="container mx-auto px-4 py-16">
        <PageHeader
          title="Questions Fréquentes"
          description="Trouvez rapidement des réponses à vos questions sur nos services, produits et conseils d'entretien"
        />

      {/* Mobile-Optimized FAQ Accordion - Only on Mobile */}
      <div className="md:hidden max-w-4xl mx-auto">
        <MobileFAQAccordion faqs={faqs} categories={categories} />
      </div>

      {/* Desktop FAQ Content - Original Layout */}
      <div className="hidden md:block max-w-4xl mx-auto">
        {/* Category Filter */}
        <div className="flex justify-center mb-12">
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-sm"
              >
                <Glasses className="h-3 w-3 mr-2" />
                {category.name}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.length > 0 ? (
            faqs.map((faq) => (
              <Card key={faq.id} className="overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                    <h3 className="text-lg font-semibold text-foreground pr-4">
                      {faq.question}
                    </h3>
                    <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" />
                  </summary>
                  <CardContent className="px-6 pb-6 pt-0">
                    <div className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </CardContent>
                </details>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Glasses className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Aucune FAQ disponible</h3>
              <p className="text-muted-foreground">Les questions fréquentes seront bientôt disponibles.</p>
            </div>
          )}
        </div>
      </div>
    </div>

      {/* Contact CTA */}
      <CTASection
        variant="primary"
        title="Vous ne trouvez pas votre réponse ?"
        description="Notre équipe d'experts est là pour vous aider. Contactez-nous directement pour des conseils personnalisés."
        primaryAction={{
          label: "Prendre Rendez-vous",
          href: "/appointment"
        }}
        secondaryAction={{
          label: "Nous Appeler",
          href: "/contact",
          icon: <Phone className="h-5 w-5" />
        }}
      />
      
    </div>
  );
 }

export default function FAQPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<FAQPageSkeleton />}>
        <FAQContent />
      </Suspense>
    </ErrorBoundary>
  );
}

function FAQPageSkeleton() {
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

      {/* Category Filter */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-12">
          <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
        </div>
      </div>

      {/* FAQ List */}
      <div className="container mx-auto px-4 py-8">
        <FAQListSkeleton count={8} />
      </div>
    </div>
  );
} 