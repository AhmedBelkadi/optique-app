'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TestimonialTable from './TestimonialTable';
import { Testimonial } from '@/features/testimonials/schema/testimonialSchema';
import { getAllTestimonialsAction } from '@/features/testimonials/actions/getAllTestimonialsAction';
import Link from 'next/link';

interface TestimonialsContainerProps {
  initialTestimonials: Testimonial[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function TestimonialsContainer({ 
  initialTestimonials, 
  pagination 
}: TestimonialsContainerProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'hidden' | 'deleted'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'updatedAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const refreshTestimonials = async () => {
    setIsLoading(true);
    try {
      const result = await getAllTestimonialsAction({
        search: search || undefined,
        isActive: statusFilter === 'active' ? true : statusFilter === 'hidden' ? false : undefined,
        isDeleted: statusFilter === 'deleted',
        sortBy,
        sortOrder,
        page: 1,
        limit: 50, // Show more items for better UX
      });

      if (result.success) {
        setTestimonials(result.data || []);
      }
    } catch (error) {
      console.error('Error refreshing testimonials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      refreshTestimonials();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search, statusFilter, sortBy, sortOrder]);

  const handleRefresh = () => {
    refreshTestimonials();
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
             <div className="bg-background rounded-lg border p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search testimonials..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-border focus:border-primary focus:ring-primary"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-48">
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="border-border focus:border-primary focus:ring-primary">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Testimonials</SelectItem>
                <SelectItem value="active">Published</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="w-full sm:w-48">
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="border-border focus:border-primary focus:ring-primary">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date Created</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="updatedAt">Last Updated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <div className="w-full sm:w-32">
            <Select value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
              <SelectTrigger className="border-border focus:border-primary focus:ring-primary">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest First</SelectItem>
                <SelectItem value="asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Create Button */}
          <Link href="/admin/testimonials/new">
            <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200">
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </Link>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''} found
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="text-muted-foreground hover:text-foreground"
        >
          <Filter className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Testimonials Table */}
      {isLoading ? (
                 <div className="bg-background rounded-lg border p-8 shadow-sm">
          <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground">Loading testimonials...</span>
          </div>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-background rounded-lg border p-8 shadow-sm text-center">
          <div className="text-muted-foreground">
            <p className="text-lg font-medium mb-2">No testimonials found</p>
            <p className="text-sm">
              {search || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first testimonial'
              }
            </p>
            {!search && statusFilter === 'all' && (
              <Link href="/admin/testimonials/new">
                <Button className="mt-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Testimonial
                </Button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <TestimonialTable testimonials={testimonials} onRefresh={handleRefresh} />
      )}
    </div>
  );
} 