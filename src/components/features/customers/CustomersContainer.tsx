'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CustomerTable from './CustomerTable';
import { Customer } from '@/features/customers/schema/customerSchema';
import { getAllCustomersAction } from '@/features/customers/actions/getAllCustomersAction';
import Link from 'next/link';

interface CustomersContainerProps {
  initialCustomers: Customer[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function CustomersContainer({ 
  initialCustomers, 
  pagination 
}: CustomersContainerProps) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'deleted'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'createdAt' | 'updatedAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const refreshCustomers = async () => {
    setIsLoading(true);
    try {
      const result = await getAllCustomersAction({
        search: search || undefined,
        isDeleted: statusFilter === 'deleted',
        sortBy,
        sortOrder,
        page: 1,
        limit: 50,
      });

      if (result.success) {
        setCustomers(result.data || []);
      }
    } catch (error) {
      console.error('Error refreshing customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      refreshCustomers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search, statusFilter, sortBy, sortOrder]);

  const handleRefresh = () => {
    refreshCustomers();
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
                placeholder="Search customers..."
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
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
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
                <SelectItem value="createdAt">Date Created</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
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
                <SelectItem value="desc">Newest First</SelectItem>
                <SelectItem value="asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Create Button */}
          <Link href="/admin/customers/new">
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </Link>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {customers.length} customer{customers.length !== 1 ? 's' : ''} found
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

      {/* Customers Table */}
      {isLoading ? (
        <div className="bg-white rounded-lg border p-8 shadow-sm">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-2 text-gray-600">Loading customers...</span>
          </div>
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white rounded-lg border p-8 shadow-sm text-center">
          <div className="text-gray-500">
            <p className="text-lg font-medium mb-2">No customers found</p>
            <p className="text-sm">
              {search || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first customer'
              }
            </p>
            {!search && statusFilter === 'all' && (
              <Link href="/admin/customers/new">
                <Button className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Customer
                </Button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <CustomerTable customers={customers} onRefresh={handleRefresh} />
      )}
    </div>
  );
} 