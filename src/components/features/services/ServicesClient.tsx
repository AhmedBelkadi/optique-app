'use client';

import { useState, useCallback } from 'react';
import { Service } from '@/features/services/schema/serviceSchema';
import { ServicesList } from './ServicesList';
import { ServiceForm } from './ServiceForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Settings, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ServicesClientProps {
  services: Service[];
}

export default function ServicesClient({ services: initialServices }: ServicesClientProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const router = useRouter();

  // Callback to refresh data without hard reload
  const refreshData = useCallback(() => {
    router.refresh();
  }, [router]);

  // Handle service creation success
  const handleServiceCreated = useCallback((newService: Service) => {
    setServices(prev => [newService, ...prev]);
  }, []);

  // Handle service update success
  const handleServiceUpdated = useCallback((updatedService: Service) => {
    setServices(prev => 
      prev.map(service => service.id === updatedService.id ? updatedService : service)
    );
  }, []);

  // Handle service deletion success
  const handleServiceDeleted = useCallback((deletedServiceId: string) => {
    setServices(prev => prev.filter(service => service.id !== deletedServiceId));
  }, []);

  const activeServices = services.filter(s => s.isActive);
  const inactiveServices = services.filter(s => !s.isActive);

  return (
    <div className="space-y-8">
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
        onRefresh={refreshData}
        onServiceCreated={handleServiceCreated}
        onServiceUpdated={handleServiceUpdated}
        onServiceDeleted={handleServiceDeleted}
      />
    </div>
  );
}
