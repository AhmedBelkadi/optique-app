'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  X, 
  DollarSign, 
  Tag, 
  Package, 
  Hash,
  SortAsc,
  SortDesc
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description?: string | null;
}

interface ProductFiltersProps {
  categories: Category[];
}

const ProductFilters = React.memo(({ categories }: ProductFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');
  const [brandFilter, setBrandFilter] = useState(searchParams.get('brand') || '');
  const [referenceFilter, setReferenceFilter] = useState(searchParams.get('reference') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (categoryFilter) params.set('category', categoryFilter);
    if (brandFilter) params.set('brand', brandFilter);
    if (referenceFilter) params.set('reference', referenceFilter);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sortBy) params.set('sortBy', sortBy);
    if (sortOrder) params.set('sortOrder', sortOrder);

    const newQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (newQuery === currentQuery) return;

    const newURL = newQuery ? `?${newQuery}` : '/admin/products';
    router.push(newURL, { scroll: false });
  }, [
    searchTerm,
    categoryFilter,
    brandFilter,
    referenceFilter,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    searchParams,
    router,
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateURL();
    }, 300); // debounce delay

    return () => clearTimeout(timeout);
  }, [updateURL]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setCategoryFilter('');
    setBrandFilter('');
    setReferenceFilter('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('createdAt');
    setSortOrder('desc');
  }, []);

  const hasActiveFilters =
    searchTerm || categoryFilter || brandFilter || referenceFilter || minPrice || maxPrice ||
    sortBy !== 'createdAt' || sortOrder !== 'desc';

  const activeFilterCount = [
    searchTerm,
    categoryFilter,
    brandFilter,
    referenceFilter,
    minPrice,
    maxPrice,
    sortBy !== 'createdAt',
    sortOrder !== 'desc'
  ].filter(Boolean).length;

  return (
    <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Filter className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">Filters</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Refine your product search</p>
            </div>
          </div>
          
          {hasActiveFilters && (
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border border-indigo-200">
                {activeFilterCount} active
              </Badge>
              <Button 
                variant="ghost" 
                onClick={clearFilters} 
                className="text-gray-500 hover:text-gray-700 h-8 px-3"
              >
                <X className="w-4 h-4 mr-1" />
                Clear all
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Label className="text-sm font-medium text-gray-700">Search & Discovery</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-xs font-medium text-gray-600">Search Products</Label>
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, description, or reference..."
                className="h-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-xs font-medium text-gray-600">Category</Label>
              <Select
                value={categoryFilter || 'all'}
                onValueChange={(val) => setCategoryFilter(val === 'all' ? '' : val)}
              >
                <SelectTrigger id="category" className="h-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-gray-400" />
            <Label className="text-sm font-medium text-gray-700">Product Details</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand" className="text-xs font-medium text-gray-600">Brand</Label>
              <Input
                id="brand"
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                placeholder="Enter brand name..."
                className="h-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference" className="text-xs font-medium text-gray-600">Reference</Label>
              <Input
                id="reference"
                value={referenceFilter}
                onChange={(e) => setReferenceFilter(e.target.value)}
                placeholder="Enter product reference..."
                className="h-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Price Range Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <Label className="text-sm font-medium text-gray-700">Price Range</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minPrice" className="text-xs font-medium text-gray-600">Minimum Price</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <Input
                  id="minPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="h-10 pl-7 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPrice" className="text-xs font-medium text-gray-600">Maximum Price</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <Input
                  id="maxPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="h-10 pl-7 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="999.99"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sorting Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <SortAsc className="w-4 h-4 text-gray-400" />
            <Label className="text-sm font-medium text-gray-700">Sorting & Organization</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sortBy" className="text-xs font-medium text-gray-600">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sortBy" className="h-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date Created</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="brand">Brand</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortOrder" className="text-xs font-medium text-gray-600">Sort Order</Label>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger id="sortOrder" className="h-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ProductFilters.displayName = 'ProductFilters';
export default ProductFilters;
