import { Skeleton } from '@/components/ui/skeleton';
import { HelpCircle } from 'lucide-react';

export default function FAQSkeleton() {
  return (
    <div className="space-y-12">
      {/* All Questions Section Skeleton */}
      <div className="text-center mb-8">
        <Skeleton className="h-9 w-48 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="h-6 w-80" />
              </div>
              <Skeleton className="w-5 h-5 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Browse by Topic Section Skeleton */}
      <div className="text-center mb-8">
        <Skeleton className="h-9 w-48 mx-auto mb-4" />
        <Skeleton className="h-6 w-80 mx-auto" />
      </div>

      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, themeIndex) => (
          <div key={themeIndex} className="bg-card border rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-20" />
            </div>

            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-72" />
                    <Skeleton className="w-4 h-4 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
