'use client';

import { useState, useCallback } from 'react';
import { Service } from '@/features/services/schema/serviceSchema';
import { ServicesList } from './ServicesList';
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



  return (
    <div className="space-y-8">

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
