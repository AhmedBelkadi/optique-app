import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function UsersSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Avatar Section */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 overflow-hidden flex items-center justify-center">
                <Skeleton className="w-20 h-20 rounded-full" />
                <Skeleton className="absolute top-3 right-3 w-16 h-6 rounded-full" />
              </div>

              {/* User Info */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>

              {/* Roles */}
              <div className="flex gap-1">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>

              {/* Created Date */}
              <Skeleton className="h-4 w-24" />

              {/* Actions */}
              <div className="flex justify-end">
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
