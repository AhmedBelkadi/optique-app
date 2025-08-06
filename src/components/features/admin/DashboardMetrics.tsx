import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FolderOpen, Users, Calendar, TrendingUp } from 'lucide-react';
import { getAllProducts } from '@/features/products/queries/getAllProducts';
import { getAllCategories } from '@/features/categories/services/getAllCategories';
import { getAllCustomers } from '@/features/customers/services/getAllCustomers';
import { getAllAppointments } from '@/features/appointments/services/getAllAppointments';

export default async function DashboardMetrics() {
  // Fetch all metrics in parallel
  const [productsResult, categoriesResult, customersResult, appointmentsResult] = await Promise.all([
    getAllProducts({ limit: 1, page: 1 }), // We only need the count
    getAllCategories(),
    getAllCustomers({ limit: 1, page: 1 }), // We only need the count
    getAllAppointments({ limit: 1, page: 1 }), // We only need the count
  ]);

  const metrics = [
    {
      title: 'Total Products',
      value: productsResult.success ? productsResult.pagination?.total || 0 : 0,
      icon: Package,
      description: 'Products in catalog',
      trend: '+12% from last month',
    },
    {
      title: 'Categories',
      value: categoriesResult.success ? categoriesResult.data?.length || 0 : 0,
      icon: FolderOpen,
      description: 'Product categories',
      trend: '+2 from last month',
    },
    {
      title: 'Customers',
      value: customersResult.success ? customersResult.pagination?.total || 0 : 0,
      icon: Users,
      description: 'Registered customers',
      trend: '+8% from last month',
    },
    {
      title: 'Appointments',
      value: appointmentsResult.success ? appointmentsResult.pagination?.total || 0 : 0,
      icon: Calendar,
      description: 'Scheduled appointments',
      trend: '+15% from last month',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => {
        const IconComponent = metric.icon;
        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <IconComponent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
              {/* <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {metric.trend}
              </div> */}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 