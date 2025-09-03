import { Suspense } from 'react';
import { getAllServicesAction } from '@/features/services/actions/getAllServicesAction';
import { ServicesList } from '@/components/features/services/ServicesList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Settings, Info } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

async function ServicesContent() {
  const result = await getAllServicesAction();
  
  if (!result.success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Erreur de chargement</h2>
          <p className="text-muted-foreground">{result.error}</p>
        </div>
      </div>
    );
  }

  const services = result.data || [];
  const activeServices = services.filter(s => s.isActive);
  const inactiveServices = services.filter(s => !s.isActive);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <PageHeader
        title="Gestion des Services"
        description="Configurez les services affichés dans le footer et sur la page de rendez-vous"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground">
              Services configurés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services Actifs</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeServices.length}</div>
            <p className="text-xs text-muted-foreground">
              Visibles sur le site
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services Inactifs</CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{inactiveServices.length}</div>
            <p className="text-xs text-muted-foreground">
              Masqués du site
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Info className="h-5 w-5" />
            Information
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800">
          <div className="space-y-2 text-sm">
            <p>• Les services actifs sont affichés dans le <strong>footer</strong> du site (maximum 6)</p>
            <p>• Les services sont également visibles sur la <strong>page de rendez-vous</strong> (maximum 5)</p>
            <p>• L'ordre d'affichage peut être modifié avec le bouton "Réorganiser"</p>
            <p>• Les services inactifs ne sont pas affichés sur le site public</p>
          </div>
        </CardContent>
      </Card>

      {/* Services List */}
      <ServicesList 
        services={services} 
        onRefresh={() => window.location.reload()} 
      />
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="h-8 bg-muted rounded w-64 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
          <div className="h-96 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
    }>
      <ServicesContent />
    </Suspense>
  );
}
