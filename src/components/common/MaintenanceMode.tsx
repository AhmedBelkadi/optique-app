'use client';

import { Wrench, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MaintenanceModeProps {
  siteName?: string;
}

export default function MaintenanceMode({ siteName = 'Optique' }: MaintenanceModeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
            <Wrench className="h-8 w-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Under Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-muted-foreground">
              We're currently performing some maintenance on our site to improve your experience.
            </p>
            <p className="text-sm text-muted-foreground">
              We'll be back shortly. Thank you for your patience!
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Expected completion: Soon</span>
          </div>

          <div className="pt-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.reload()}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Check Again
            </Button>
          </div>

          <div className="text-xs text-muted-foreground pt-4 border-t">
            <p>{siteName} - Professional Eyewear Services</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 