import { getContactSettings } from '@/features/settings/services/contactSettings';
import { getSiteSettings } from '@/features/settings/services/siteSettings';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Instagram,
  Facebook
} from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/page-header';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { PageHeaderSkeleton } from '@/components/ui/skeletons';
import ContactForm from '@/components/features/contact/ContactForm';
import MobileContactForm from '@/components/features/contact/MobileContactForm';
import { MobileContactMap } from '@/components/features/contact/MobileContactMap';

async function ContactContent() {
  const [contactResult, siteSettingsResult] = await Promise.all([
    getContactSettings(),
    getSiteSettings()
  ]);
  const contactSettings = contactResult.data;
  const siteSettings = siteSettingsResult.success ? siteSettingsResult.data : null;

  if (!contactSettings) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Erreur de chargement</h2>
          <p className="text-muted-foreground">Impossible de charger les informations de contact.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Contact', href: '/contact' }
        ]} 
      />

      {/* Page Header */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <PageHeader
          title="Contactez-Nous"
          description="Nous sommes là pour répondre à toutes vos questions et vous accompagner dans vos besoins optiques"
        />

      <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
        {/* Contact Form - Responsive */}
        <div className="md:hidden">
          <MobileContactForm />
        </div>
        <div className="hidden md:block">
          <ContactForm />
        </div>

        {/* Contact Information */}
        <div className="space-y-6 md:space-y-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 md:mb-6">Nos Coordonnées</h2>
            <p className="text-muted-foreground mb-6 md:mb-8 text-sm md:text-base">
              N'hésitez pas à nous contacter pour toute question ou demande de renseignements.
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-4 md:space-y-6">
            {/* Address */}
            <div className="flex items-start space-x-3 md:space-x-4">
              <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">Adresse</h3>
                <p className="text-muted-foreground whitespace-pre-line text-sm md:text-base">
                  {contactSettings.address}
                </p>
                {contactSettings.googleMapLink && (
                  <Link 
                    href={contactSettings.googleMapLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:text-primary/80 text-sm mt-2 h-10 px-3 rounded-md border border-primary/20 hover:bg-primary/5 transition-colors"
                  >
                    <MapPin className="w-4 h-4 mr-1" />
                    Voir sur la carte
                  </Link>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-3 md:space-x-4">
              <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">Téléphone</h3>
                <p className="text-muted-foreground text-sm md:text-base">{contactSettings.phone}</p>
                {contactSettings.whatsappChatLink && (
                  <Link 
                    href={contactSettings.whatsappChatLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:text-primary/80 text-sm mt-2 h-10 px-3 rounded-md border border-primary/20 hover:bg-primary/5 transition-colors"
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Chat WhatsApp
                  </Link>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-3 md:space-x-4">
              <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">Email</h3>
                <a 
                  href={`mailto:${contactSettings.contactEmail}`}
                  className="text-primary hover:text-primary/80 text-sm md:text-base break-all"
                >
                  {contactSettings.contactEmail}
                </a>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="flex items-start space-x-3 md:space-x-4">
              <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">Horaires d'ouverture</h3>
                <p className="text-muted-foreground whitespace-pre-line text-sm md:text-base">
                  {contactSettings.openingHours}
                </p>
              </div>
            </div>

            {/* Social Media */}
            {(contactSettings.instagramLink || contactSettings.facebookLink) && (
              <div className="flex items-start space-x-3 md:space-x-4">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <div className="flex space-x-1">
                    {contactSettings.instagramLink && <Instagram className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
                    {contactSettings.facebookLink && <Facebook className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">Suivez-nous</h3>
                  <div className="flex flex-wrap gap-2">
                    {contactSettings.instagramLink && (
                      <Link 
                        href={contactSettings.instagramLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary hover:text-primary/80 text-sm h-10 px-3 rounded-md border border-primary/20 hover:bg-primary/5 transition-colors"
                      >
                        <Instagram className="w-4 h-4 mr-1" />
                        Instagram
                      </Link>
                    )}
                    {contactSettings.facebookLink && (
                      <Link 
                        href={contactSettings.facebookLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary hover:text-primary/80 text-sm h-10 px-3 rounded-md border border-primary/20 hover:bg-primary/5 transition-colors"
                      >
                        <Facebook className="w-4 h-4 mr-1" />
                        Facebook
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Map */}
          <div className="mt-6 md:mt-8">
            {/* Mobile Map */}
            <div className="md:hidden">
              <MobileContactMap 
                googleMapEmbed={contactSettings.googleMapEmbed}
                address={contactSettings.address}
                googleMapLink={contactSettings.googleMapLink}
                siteName={siteSettings?.siteName}
              />
            </div>
            
            {/* Desktop Map */}
            <div className="hidden md:block">
              <h3 className="font-semibold text-foreground mb-4 text-base">Notre Localisation</h3>
              <div className="h-64 rounded-lg overflow-hidden border border-border">
                <iframe
                  src={contactSettings.googleMapEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Localisation ${siteSettings?.siteName || 'nous'}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageHeaderSkeleton />}>
        <ContactContent />
      </Suspense>
    </ErrorBoundary>
  );
} 