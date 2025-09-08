import { getAllAboutSections } from '@/features/about/services/getAllAboutSections';
import { getAboutBenefits } from '@/features/about/services/getAboutBenefits';
import { getContactSettings } from '@/features/settings/services/contactSettings';
import { getThemeSettings } from '@/features/settings/services/themeSettings';
import { getSiteSettings } from '@/features/settings/services/siteSettings';
import Image from 'next/image';
import { Award, MapPin, TrendingUp, Phone, Mail, Clock, Eye, Shield, Users, Heart, Star, CheckCircle, Zap, Target, Calendar, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { CTASection } from '@/components/ui/cta-section';
import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { AboutSectionSkeleton, BenefitsGridSkeleton, PageHeaderSkeleton } from '@/components/ui/skeletons';
import { MobileAboutContent } from '@/components/features/about/MobileAboutContent';
import Link from 'next/link';

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // optional, stricter

async function AboutContent() {
  // Fetch about page data
  const [sectionsResult, benefitsResult, contactResult, themeSettingsResult, siteSettingsResult] = await Promise.all([
    getAllAboutSections(),
    getAboutBenefits(),
    getContactSettings(),
    getThemeSettings(),
    getSiteSettings()
  ]);

  const aboutSections = sectionsResult.success && sectionsResult.data ? sectionsResult.data : [];
  const benefits = benefitsResult.success && benefitsResult.data ? benefitsResult.data : [];
  const contactSettings = contactResult.data;
  const themeSettings = themeSettingsResult.success ? themeSettingsResult.data : null;
  const siteSettings = siteSettingsResult.success ? siteSettingsResult.data : null;

  // Dynamic icon mapping for CMS benefits
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'Eye': Eye,
      'Shield': Shield,
      'Clock': Clock,
      'Users': Users,
      'Award': Award,
      'Heart': Heart,
      'Star': Star,
      'CheckCircle': CheckCircle,
      'Zap': Zap,
      'Target': Target,
      'MapPin': MapPin,
      'TrendingUp': TrendingUp
    };
    return iconMap[iconName] || Award; // Default to Award if icon not found
  };

  // Use CMS benefits or fallback to defaults
  const features = benefits.length > 0 ? benefits.map(benefit => ({
    icon: getIconComponent(benefit.icon),
    title: benefit.title || 'Valeur',
    description: benefit.description || '',
    highlight: benefit.highlight || 'Valeur ajoutée'
  })) : [
    {
      icon: getIconComponent('Award'),
      title: "Qualité Premium",
      description:
        "Nous sélectionnons rigoureusement nos produits parmi les meilleures marques internationales. Chaque monture et chaque verre répond aux plus hauts standards de qualité pour garantir votre satisfaction et votre confort visuel.",
      highlight: "Plus de 500 références de qualité",
    },
    {
      icon: getIconComponent('MapPin'),
      title: "Expertise Locale",
      description:
        `Implantés au cœur de ${contactSettings?.city || 'notre ville'} depuis plus de 15 ans, nous connaissons parfaitement les besoins de notre clientèle. Notre équipe d'opticiens diplômés vous accompagne avec passion et professionnalisme dans tous vos projets optiques.`,
      highlight: `15 ans d'expérience à ${contactSettings?.city || 'notre ville'}`,
    },
    {
      icon: getIconComponent('TrendingUp'),
      title: "Tendances & Innovation",
      description:
        "Nous restons à l'affût des dernières tendances et innovations technologiques. Des montures design aux verres progressifs dernière génération, nous vous proposons toujours ce qui se fait de mieux en optique.",
      highlight: "Toujours à la pointe de l'innovation",
    },
  ];

  // Define varied colors for different features
  const featureColors = [
    '#3B82F6', // Blue for quality
    '#10B981', // Green for expertise  
    '#8B5CF6', // Purple for innovation
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'À Propos', href: '/about' }
        ]} 
      />

      {/* Page Header */}
      <div className="container mx-auto px-4 py-12">
        <PageHeader
          title={`À Propos de ${siteSettings?.siteName || 'nous'}`}
          description={`Découvrez l'histoire de votre opticien de confiance à ${contactSettings?.city || 'notre ville'}`}
        />

        {/* Mobile-Optimized About Content - Only on Mobile */}
        <div className="md:hidden">
          <MobileAboutContent 
            aboutSections={aboutSections}
            benefits={benefits}
            contactSettings={contactSettings || null}
            themeSettings={themeSettings}
          />
        </div>

        {/* Desktop About Content - Original Layout */}
        <div className="hidden md:block space-y-16">
          {/* Story Section */}
          <section className="py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">Notre Histoire</h2>
                  <div className="w-20 h-1 bg-primary rounded-full"></div>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  {aboutSections.length > 0 ? (
                    aboutSections.map((section, index) => (
                      <p key={section.id}>
                        {section.content}
                      </p>
                    ))
                  ) : (
                    <>
                      <p>
                        Fondée avec passion, notre boutique d'optique est née d'une vision commune : offrir à
                        chaque client une vision parfaite et un style unique. Ce qui a commencé comme un petit magasin familial
                        dans le centre de ${contactSettings?.city || 'notre ville'} s'est transformé en une référence incontournable de l'optique dans la région.
                      </p>
                      <p>
                        Aujourd'hui, nous sommes fiers de servir de nombreux clients satisfaits, des familles locales aux
                        visiteurs internationaux. Notre secret ? Un service personnalisé, des produits de qualité et une équipe
                        passionnée qui considère chaque client comme un membre de la famille.
                      </p>
                      <p className="font-medium text-warning">
                        "Chez {siteSettings?.siteName || 'nous'}, chaque regard compte" - c'est plus qu'un slogan, c'est notre engagement
                        quotidien.
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={siteSettings?.imageAboutSection || '/placeholder.svg?height=500&width=600'}
                    alt={`Façade du magasin ${siteSettings?.siteName || 'nous'}`}
                    width={600}
                    height={500}
                    className="w-full h-96 lg:h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 bg-background/90 backdrop-blur-sm rounded-lg px-4 py-2">
                    <p className="text-sm font-medium text-foreground">Notre magasin à {contactSettings?.city || 'notre ville'}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-foreground mb-4">Ce qui Nous Distingue</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Découvrez les valeurs et l'expertise qui font de {siteSettings?.siteName || 'nous'} votre partenaire de confiance
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => {
                  const iconColor = featureColors[index] || '#6B7280';
                  return (
                    <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                      <CardContent className="p-8 text-center">
                        <div 
                          className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                          style={{
                            background: `linear-gradient(135deg, ${iconColor}20, ${iconColor}40)`
                          }}
                        >
                          <feature.icon 
                            className="h-8 w-8" 
                            style={{ color: iconColor }}
                          />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          {feature.description}
                        </p>
                        <Badge 
                          variant="secondary" 
                          className="text-sm"
                          style={{
                            backgroundColor: `${iconColor}20`,
                            color: iconColor
                          }}
                        >
                          {feature.highlight}
                        </Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">Nous Rencontrer</h2>
                <p className="text-xl text-muted-foreground">
                  Venez découvrir notre univers et laissez-nous vous accompagner dans votre choix
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Map */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-foreground">Notre Localisation</h3>
                  <div className="h-80 rounded-2xl overflow-hidden shadow-lg">
                    {contactSettings?.googleMapEmbed ? (
                      <iframe
                        src={contactSettings.googleMapEmbed}
                        className="w-full h-full border-0"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Localisation ${siteSettings?.siteName || 'nous'}`}
                      />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-muted/30">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                          <MapPin className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h4 className="text-lg font-semibold text-foreground mb-2">Localisation</h4>
                        <p className="text-muted-foreground mb-4 max-w-sm">
                          Notre boutique est située au cœur de {contactSettings?.city || 'notre ville'}, facilement accessible
                        </p>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p>📍 Centre-ville de {contactSettings?.city || 'notre ville'}</p>
                          <p>🚗 Parking disponible</p>
                          <p>🚌 Accessible en transport</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold text-foreground">Informations de Contact</h3>
                  <div className="space-y-6">
                    {contactSettings?.address && (
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: '#3B82F620' }}
                        >
                          <MapPin className="h-6 w-6" style={{ color: '#3B82F6' }} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Adresse</h4>
                          <p className="text-muted-foreground whitespace-pre-line">
                            {contactSettings.address}
                          </p>
                        </div>
                      </div>
                    )}

                    {contactSettings?.phone && (
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: '#10B98120' }}
                        >
                          <Phone className="h-6 w-6" style={{ color: '#10B981' }} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Téléphone</h4>
                          <p className="text-muted-foreground">{contactSettings.phone}</p>
                        </div>
                      </div>
                    )}

                    {contactSettings?.contactEmail && (
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: '#8B5CF620' }}
                        >
                          <Mail className="h-6 w-6" style={{ color: '#8B5CF6' }} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Email</h4>
                          <p className="text-muted-foreground break-all">{contactSettings.contactEmail}</p>
                        </div>
                      </div>
                    )}

                    {contactSettings?.openingHours && (
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: '#F59E0B20' }}
                        >
                          <Clock className="h-6 w-6" style={{ color: '#F59E0B' }} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Horaires d'ouverture</h4>
                          <div className="text-muted-foreground whitespace-pre-line">
                            {contactSettings.openingHours}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    {contactSettings?.phone && (
                      <Button 
                        className="w-full bg-green-500 hover:bg-green-600 font-semibold py-4 h-14 text-lg"
                        asChild
                      >
                        <Link href={`tel:${contactSettings.phone}`}>
                          <Phone className="mr-3 h-5 w-5" />
                          Nous Appeler
                        </Link>
                      </Button>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        variant="default"
                        className="h-12"
                        asChild
                      >
                        <Link href="/appointment">
                          <Calendar className="mr-2 h-4 w-4" />
                          Prendre RDV
                        </Link>
                      </Button>
                      <Button 
                        variant="secondary"
                        className="h-12"
                        asChild
                      >
                        <Link href="/contact">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Nous Contacter
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Call to Action */}
        <CTASection
          variant="primary"
          title="Prêt à Découvrir Votre Style ?"
          description="Venez nous rencontrer pour une consultation personnalisée et trouvez les lunettes parfaites pour vous."
          primaryAction={{
            label: "Prendre Rendez-vous",
            href: "/appointment"
          }}
          secondaryAction={{
            label: "Voir Notre Catalogue",
            href: "/products"
          }}
        />

        
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<AboutPageSkeleton />}>
        <AboutContent />
      </Suspense>
    </ErrorBoundary>
  );
}

function AboutPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="h-6 bg-muted rounded w-24 animate-pulse"></div>
      </div>

      {/* Page Header */}
      <div className="container mx-auto px-4 py-12">
        <PageHeaderSkeleton />
      </div>

      {/* Story Section */}
      <div className="container mx-auto px-4 py-8">
        <AboutSectionSkeleton />
      </div>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-8 bg-muted rounded mb-4 animate-pulse max-w-48 mx-auto"></div>
            <div className="h-6 bg-muted rounded max-w-2xl mx-auto animate-pulse"></div>
          </div>
          <BenefitsGridSkeleton count={6} />
        </div>
      </section>
    </div>
  );
} 