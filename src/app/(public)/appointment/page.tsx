import { Clock, Calendar, Users, Shield, Star } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { AppointmentFormSkeleton, InformationCardsSkeleton, PageHeaderSkeleton } from '@/components/ui/skeletons';
import { ResponsiveAppointmentForm } from '@/components/features/appointments/ResponsiveAppointmentForm';
import { AppointmentInfoCards } from '@/components/features/appointments/AppointmentInfoCards';
import { getContactSettings } from '@/features/settings/services/contactSettings';
import { getPublicServices } from '@/features/services/services/getPublicServices';

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // optional, stricter

async function AppointmentContent() {
  const [contactSettings, servicesResult] = await Promise.all([
    getContactSettings(),
    getPublicServices()
  ]);
  const contactSettingsData = contactSettings.data;
  const services = servicesResult.success && servicesResult.data ? servicesResult.data : [];

  if (!contactSettings) {
    return (
      <div className="min-h-screen bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Erreur de chargement</h2>
          <p className="text-muted-foreground">Impossible de charger les informations de contact.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Breadcrumb */}
      <div className="bg-background/80 backdrop-blur-sm border-b">
        {/* <div className="container mx-auto px-4 py-4"> */}
          <Breadcrumb 
            items={[
              { label: 'Rendez-vous', href: '/appointment' }
            ]} 
          />
        {/* </div> */}
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full translate-y-40 -translate-x-40"></div>
        
        <div className="relative container mx-auto px-4 py-16 max-w-7xl">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              <Calendar className="h-4 w-4" />
              Réservation en ligne
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Prendre un{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                Rendez-vous
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
              Réservez votre consultation avec nos experts en optique. 
              Choisissez la date et l'heure qui vous conviennent pour une expérience personnalisée.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 text-primary" />
                <span>Clients satisfaits</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>Consultation sécurisée</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4 text-primary" />
                <span>Expertise reconnue</span>
              </div>
            </div>

          
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Appointment Form - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <ResponsiveAppointmentForm contactSettings={contactSettingsData ?? null} />
          </div>

          {/* Information Section - Takes 1 column on large screens */}
          <div className="lg:col-span-1">
            <AppointmentInfoCards contactSettings={contactSettingsData ?? null} services={services} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppointmentPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<AppointmentPageSkeleton />}>
        <AppointmentContent />
      </Suspense>
    </ErrorBoundary>
  );
}

function AppointmentPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Breadcrumb */}
      <div className="bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="h-6 bg-muted rounded w-20 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-2 animate-pulse"></div>
            <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>
        <div className="relative container mx-auto px-4 py-16 max-w-7xl">
          <div className="text-center max-w-4xl mx-auto">
            <div className="h-8 bg-muted rounded-full w-48 mx-auto mb-6 animate-pulse"></div>
            <div className="h-16 bg-muted rounded w-3/4 mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 bg-muted rounded w-2/3 mx-auto mb-8 animate-pulse"></div>
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-6 bg-muted rounded w-32 animate-pulse"></div>
              ))}
            </div>
            <div className="h-20 bg-muted rounded w-80 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AppointmentFormSkeleton />
          </div>
          <div className="lg:col-span-1">
            <InformationCardsSkeleton count={3} />
          </div>
        </div>
      </div>
    </div>
  );
}