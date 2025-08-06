'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppointmentTable from './AppointmentTable';
import { Appointment, AppointmentStatus } from '@/features/appointments/schema/appointmentSchema';
import { getAllAppointmentsAction } from '@/features/appointments/actions/getAllAppointmentsAction';
import Link from 'next/link';

interface AppointmentsContainerProps {
  initialAppointments: Appointment[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function AppointmentsContainer({ 
  initialAppointments, 
  pagination 
}: AppointmentsContainerProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all');
  const [sortBy, setSortBy] = useState<'startTime' | 'title' | 'createdAt' | 'updatedAt'>('startTime');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const refreshAppointments = async () => {
    setIsLoading(true);
    try {
      const result = await getAllAppointmentsAction({
        search: search || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter as AppointmentStatus,
        isDeleted: false,
        sortBy,
        sortOrder,
        page: 1,
        limit: 50,
      });

      if (result.success) {
        setAppointments(result.data || []);
      }
    } catch (error) {
      console.error('Error refreshing appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      refreshAppointments();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search, statusFilter, sortBy, sortOrder]);

  const handleRefresh = () => {
    refreshAppointments();
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search appointments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-48">
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Appointments</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="NO_SHOW">No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="w-full sm:w-48">
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="startTime">Date & Time</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="createdAt">Date Created</SelectItem>
                <SelectItem value="updatedAt">Last Updated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <div className="w-full sm:w-32">
            <Select value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
              <SelectTrigger className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Earliest First</SelectItem>
                <SelectItem value="desc">Latest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Create Button */}
          <Link href="/admin/appointments/new">
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <Plus className="w-4 h-4 mr-2" />
              Add Appointment
            </Button>
          </Link>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {appointments.length} appointment{appointments.length !== 1 ? 's' : ''} found
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="text-gray-600 hover:text-gray-800"
        >
          <Filter className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Appointments Table */}
      {isLoading ? (
        <div className="bg-white rounded-lg border p-8 shadow-sm">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-2 text-gray-600">Loading appointments...</span>
          </div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-lg border p-8 shadow-sm text-center">
          <div className="text-gray-500">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">No appointments found</p>
            <p className="text-sm">
              {search || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first appointment'
              }
            </p>
            {!search && statusFilter === 'all' && (
              <Link href="/admin/appointments/new">
                <Button className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Appointment
                </Button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <AppointmentTable appointments={appointments} onRefresh={handleRefresh} />
      )}
    </div>
  );
} 