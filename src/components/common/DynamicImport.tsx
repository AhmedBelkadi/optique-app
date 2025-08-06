'use client';

import dynamic from 'next/dynamic';
import { ComponentType, Suspense } from 'react';

interface DynamicImportProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Default loading component
const DefaultLoading = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
  </div>
);

// Dynamic import wrapper
export function DynamicImport({ children, fallback = <DefaultLoading /> }: DynamicImportProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}

// Pre-configured dynamic imports for heavy components
export const DynamicDeleteProductModal = dynamic(
  () => import('@/components/features/products/DeleteProductModal'),
  {
    ssr: false,
    loading: () => <DefaultLoading />,    
  }
);

export const DynamicDeleteCategoryModal = dynamic(
  () => import('@/components/features/categories/DeleteCategoryModal'),
  {
    ssr: false,
    loading: () => <DefaultLoading />,
  }
);

export const DynamicCreateCategoryModal = dynamic(
  () => import('@/components/features/categories/CreateCategoryModal'),
  {
    ssr: false,
    loading: () => <DefaultLoading />,
  }
);

export const DynamicEditCategoryModal = dynamic(
  () => import('@/components/features/categories/EditCategoryModal'),
  {
    ssr: false,
    loading: () => <DefaultLoading />,
  }
);

export const DynamicImageUpload = dynamic(
  () => import('@/components/features/products/ImageUpload'),
  {
    ssr: false,
    loading: () => <DefaultLoading />,
  }
);

export const DynamicCategoryImageUpload = dynamic(
  () => import('@/components/features/categories/CategoryImageUpload'),
  {
    ssr: false,
    loading: () => <DefaultLoading />,
  }
);

// Generic dynamic import function
export function createDynamicImport<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: {
    ssr?: boolean;
    loading?: ComponentType<any>;
  } = {}
) {
  return dynamic(importFn, {
    ssr: false,
    loading: options.loading || DefaultLoading,
    ...options,   
  });
} 