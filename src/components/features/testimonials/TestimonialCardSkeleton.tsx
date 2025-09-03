import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function TestimonialCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center mb-4">
          <div className="flex space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-5 h-5 rounded" />
            ))}
          </div>
        </div>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex items-center">
            <Skeleton className="w-10 h-10 rounded-full mr-3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TestimonialsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <TestimonialCardSkeleton key={i} />
      ))}
    </div>
  );
}
