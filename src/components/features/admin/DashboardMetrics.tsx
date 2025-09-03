import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FolderOpen, Users, Calendar, AlertTriangle } from 'lucide-react';
import { getAllProducts } from '@/features/products/queries/getAllProducts';
import { getAllCategories } from '@/features/categories/services/getAllCategories';
import { getAllCustomers } from '@/features/customers/services/getAllCustomers';
import { getAllAppointments } from '@/features/appointments/services/getAllAppointments';
import { Badge } from '@/components/ui/badge';

export default async function DashboardMetrics() {
  const [productsResult, categoriesResult, customersResult, appointmentsResult] = await Promise.all([
    getAllProducts({ limit: 1000, page: 1 }),
    getAllCategories(),
    getAllCustomers({ limit: 1000, page: 1 }),
    getAllAppointments({ limit: 1000, page: 1 }),
  ]);

  const products = productsResult.success && productsResult.data ? productsResult.data : [];
  const customers = customersResult.success && customersResult.data ? customersResult.data : [];
  const appointments = appointmentsResult.success && appointmentsResult.data ? appointmentsResult.data : [];

  const productsWithoutImages = products.filter((p: any) => !p.images || p.images.length === 0).length;
  const productsWithoutCategories = products.filter((p: any) => !p.categories || p.categories.length === 0).length;
  const totalProducts = products.length;

  const customersWithAppointments = customers.filter((c: any) => 
    appointments.some((a: any) => a.customerId === c.id)
  ).length;
  const totalCustomers = customers.length;
  const customerEngagementRate = totalCustomers > 0 ? Math.round((customersWithAppointments / totalCustomers) * 100) : 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todaysAppointments = appointments.filter((a: any) => {
    const appointmentDate = new Date(a.startTime);
    return appointmentDate >= today && appointmentDate < tomorrow;
  });

  const appointmentStatusCounts = todaysAppointments.reduce((acc: Record<string, number>, appointment: any) => {
    const status = appointment.status?.name || 'UNKNOWN';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const metrics = [
    {
      title: 'Total des Produits',
      value: totalProducts,
      icon: Package,
      description: 'Produits dans le catalogue',
      status: 'normal' as const,
      alert: productsWithoutImages > 0 ? `${productsWithoutImages} sans images` : undefined,
    },
    {
      title: 'Catégories',
      value: categoriesResult.success ? categoriesResult.data?.length || 0 : 0,
      icon: FolderOpen,
      description: 'Catégories de produits',
      status: 'normal' as const,
    },
    {
      title: 'Clients',
      value: totalCustomers,
      icon: Users,
      description: totalCustomers > 0 ? `Taux d'engagement: ${customerEngagementRate}%` : 'Aucun client enregistré',
      status: totalCustomers === 0 ? 'info' as const : (customerEngagementRate < 50 ? 'warning' as const : 'normal' as const),
      alert: totalCustomers === 0 ? 'Commencez par ajouter des clients' : (customerEngagementRate < 50 ? 'Faible engagement' : undefined),
    },
    {
      title: 'Rendez-vous Aujourd\'hui',
      value: todaysAppointments.length,
      icon: Calendar,
      description: 'Programmés pour aujourd\'hui',
      status: todaysAppointments.length > 0 ? 'normal' as const : 'info' as const,
      alert: todaysAppointments.length === 0 ? 'Aucun rendez-vous' : undefined,
    },
  ];

  const getStatusStyles = (status: 'normal' | 'warning' | 'danger' | 'info') => {
    switch (status) {
      case 'warning':
        return 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors';
      case 'danger':
        return 'border-red-200 bg-red-50 text-red-800 hover:bg-red-100 transition-colors';
      case 'info':
        return 'border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors';
      default:
        return 'border-green-200 bg-green-50 text-green-800 hover:bg-green-100 transition-colors';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {metrics.map((metric) => {
          const IconComponent = metric.icon;
          return (
            <Card 
              key={metric.title} 
              className={`border-2 cursor-pointer transform hover:scale-105 transition-all duration-200 ${getStatusStyles(metric.status)}`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{metric.description}</p>
                
                {metric.alert && (
                  <div className="flex items-center mt-2 text-xs">
                    <AlertTriangle className="h-3 w-3 mr-1 text-amber-600" />
                    <span className="text-amber-700">{metric.alert}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {(productsWithoutImages > 0 || productsWithoutCategories > 0) && (
        <Card className="border-amber-200 bg-amber-50 hover:bg-amber-100 transition-colors">
          <CardHeader>
            <CardTitle className="text-amber-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Alertes Produits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {productsWithoutImages > 0 && (
                <div className="flex items-center justify-between p-2 bg-amber-100/50 rounded-lg">
                  <span className="text-sm text-amber-700">Produits sans images</span>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    {productsWithoutImages}
                  </Badge>
                </div>
              )}
              {productsWithoutCategories > 0 && (
                <div className="flex items-center justify-between p-2 bg-amber-100/50 rounded-lg">
                  <span className="text-sm text-amber-700">Produits sans catégories</span>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    {productsWithoutCategories}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {todaysAppointments.length > 0 && (
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Statut des Rendez-vous Aujourd'hui
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Object.entries(appointmentStatusCounts).map(([status, count]) => (
                <div key={status} className="text-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="text-2xl font-bold text-primary">{count}</div>
                  <div className="text-xs text-muted-foreground capitalize">{status.toLowerCase().replace('_', ' ')}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
