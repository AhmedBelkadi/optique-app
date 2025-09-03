'use client';

import { Megaphone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BannerPreviewProps {
  message: string;
  isActive: boolean;
}

export default function BannerPreview({ message, isActive }: BannerPreviewProps) {
  if (!isActive) {
    return (
      <Card className="border-dashed opacity-50">
        <CardHeader>
          <CardTitle className="text-sm">Banner Preview (Inactive)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <Megaphone className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Banner is inactive and won't be displayed</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Banner Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <Megaphone className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Promo
                  </Badge>
                  <p className="text-sm font-medium text-foreground">
                    {message}
                  </p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex-shrink-0 text-muted-foreground hover:text-foreground"
                disabled
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
