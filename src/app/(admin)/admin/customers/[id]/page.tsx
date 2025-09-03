import { getCustomerById } from '@/features/customers/services/getCustomerById';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Calendar, Edit, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requirePermission } from '@/lib/auth/authorization';
import { formatDateShort, formatDateLong, formatTime } from '@/lib/shared/utils/dateUtils';

interface CustomerDetailPageProps {
  params: {
    id: string;
  };
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('customers', 'read');

  const result = await getCustomerById(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const customer = result.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4"> 
         <div>
            <h1 className="text-3xl font-bold text-foreground">{customer.name}</h1>
            <p className="text-muted-foreground mt-1">Customer Details</p>
          </div>
        </div>
        <Link href={`/admin/customers/${customer.id}/edit`}>
          <Button className="bg-[linear-gradient(to_right,hsl(var(--primary)),hsl(var(--primary)/0.8))] hover:bg-[linear-gradient(to_right,hsl(var(--primary)/0.9),hsl(var(--primary)/0.7))] text-primary-foreground">
            <Edit className="w-4 h-4 mr-2" />
            Edit Customer
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>
                Basic customer details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </div>
                  <p className="font-medium">{customer.email}</p>
                </div>
                
                {customer.phone && (
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="w-4 h-4 mr-2" />
                      Phone
                    </div>
                    <p className="font-medium">{customer.phone}</p>
                  </div>
                )}
              </div>

              {customer.address && (
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    Address
                  </div>
                  <p className="font-medium">{customer.address}</p>
                </div>
              )}

              {customer.notes && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Notes</div>
                  <p className="text-foreground whitespace-pre-wrap">{customer.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Appointments</CardTitle>
              <CardDescription>
                Recent appointments for this customer
              </CardDescription>
            </CardHeader>
            <CardContent>
              {customer.appointments && customer.appointments.length > 0 ? (
                <div className="space-y-4">
                  {customer.appointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{appointment.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatDateShort(appointment.startTime)} at{' '}
                            {formatTime(appointment.startTime)}
                          </p>
                        </div>
                        <Badge variant="outline">{appointment.status.displayName}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No appointments found for this customer.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              {customer.isDeleted ? (
                <Badge variant="destructive">Deleted</Badge>
              ) : (
                <Badge variant="default">Active</Badge>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Appointments</span>
                <span className="font-medium">{customer._count?.appointments || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="font-medium">
                  {formatDateLong(customer.createdAt)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>Timestamps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  Created
                </div>
                <p className="text-sm">{formatDateShort(customer.createdAt)}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  Last Updated
                </div>
                <p className="text-sm">{formatDateShort(customer.updatedAt)}</p>
              </div>
              {customer.deletedAt && (
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    Deleted
                  </div>
                  <p className="text-sm">{formatDateShort(customer.deletedAt)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 