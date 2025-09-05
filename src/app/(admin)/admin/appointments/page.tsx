import { Suspense } from 'react';
import { getAllAppointmentsAction } from '@/features/appointments/actions/getAllAppointmentsAction';
import AppointmentsContainer from '@/components/features/appointments/AppointmentsContainer';
import AppointmentsSkeleton from '@/components/features/appointments/AppointmentsSkeleton';
import { Plus, Trash2 } from 'lucide-react';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { requirePermission } from '@/lib/auth/authorization';

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // optional, stricter

interface AppointmentsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function AppointmentsPage({ searchParams }: AppointmentsPageProps) {
  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('appointments', 'read');

  const { 
    search, 
    status, 
    sortBy, 
    sortOrder,
    page,
    limit
  } = await searchParams;
  
  // Parse pagination parameters
  const pageNum = page ? parseInt(page) : 1;
  const limitNum = limit ? parseInt(limit) : 50;
  
  const result = await getAllAppointmentsAction({
    search,
    status: status as any,
    isDeleted: false,
    sortBy: sortBy as 'startTime' | 'title' | 'createdAt' | 'updatedAt' || 'startTime',
    sortOrder: sortOrder as 'asc' | 'desc' || 'asc',
    page: pageNum,
    limit: limitNum,
  });

  const appointments = result.success && result.data ? result.data : [];
  const pagination = result.success ? result.pagination : undefined;

  return (
    <>
      <AdminPageConfig
        title="Appointments"
        subtitle="Manage your appointment calendar and schedule."
        breadcrumbs={[
          { label: 'Appointments', href: '/admin/appointments' }
        ]}
      />

      <div className="min-h-screen bg-muted/50">
        <div className="">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-2">
            <Link href="/admin/appointments/new">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="w-4 h-4 mr-2" />
                Create Appointment
              </Button>
            </Link>
            <Link href="/admin/appointments/trash">
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Trash
              </Button>
            </Link>
          </div>
          
          {/* Appointments Content */}
          <Suspense fallback={<AppointmentsSkeleton />}>
            <AppointmentsContainer 
              initialAppointments={appointments} 
              pagination={pagination}
              currentPage={pageNum}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
} 