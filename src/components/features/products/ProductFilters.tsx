'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/lib/hooks/useDebounce';

interface Category {
  id: string;
  name: string;
  description?: string | null;
}

interface ProductFiltersProps {
  categories: Category[];
}

export default function ProductFilters({ categories }: ProductFiltersProps) {
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
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const debouncedReferenceFilter = useDebounce(referenceFilter, 300);

  const updateURL = useCallback((
    search: string, 
    category: string, 
    brand: string, 
    reference: string, 
    minPrice: string, 
    maxPrice: string, 
    sortBy: string, 
    sortOrder: string
  ) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (brand) params.set('brand', brand);
    if (reference) params.set('reference', reference);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sortBy) params.set('sortBy', sortBy);
    if (sortOrder) params.set('sortOrder', sortOrder);
    
    const newURL = params.toString() ? `?${params.toString()}` : '/products';
    router.push(newURL, { scroll: false });
  }, [router]);

  useEffect(() => {
    updateURL(
      debouncedSearchTerm, 
      categoryFilter, 
      brandFilter, 
      debouncedReferenceFilter, 
      minPrice, 
      maxPrice, 
      sortBy, 
      sortOrder
    );
  }, [
    debouncedSearchTerm, 
    categoryFilter, 
    brandFilter, 
    debouncedReferenceFilter, 
    minPrice, 
    maxPrice, 
    sortBy, 
    sortOrder, 
    updateURL
  ]);

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setBrandFilter('');
    setReferenceFilter('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  const hasActiveFilters = searchTerm || categoryFilter || brandFilter || referenceFilter || minPrice || maxPrice || sortBy !== 'createdAt' || sortOrder !== 'desc';

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            Clear all filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Products
          </label>
          <input
            type="text"
            id="search"
            autoComplete="off"
            placeholder="Search by name, description, or reference..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Category
          </label>
          <select
            id="category"
            autoComplete="off"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Filter */}
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Brand
          </label>
          <input
            type="text"
            id="brand"
            autoComplete="off"
            placeholder="Enter brand name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
          />
        </div>

        {/* Reference Filter */}
        <div>
          <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Reference
          </label>
          <input
            type="text"
            id="reference"
            autoComplete="off"
            placeholder="Enter product reference..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={referenceFilter}
            onChange={(e) => setReferenceFilter(e.target.value)}
          />
        </div>

        {/* Price Range */}
        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-2">
            Min Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              id="minPrice"
              autoComplete="off"
              min="0"
              step="0.01"
              placeholder="0.00"
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-2">
            Max Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              id="maxPrice"
              autoComplete="off"
              min="0"
              step="0.01"
              placeholder="999.99"
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            id="sortBy"
            autoComplete="off"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="createdAt">Date Created</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="brand">Brand</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-2">
            Sort Order
          </label>
          <select
            id="sortOrder"
            autoComplete="off"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
    </div>
  );
} 