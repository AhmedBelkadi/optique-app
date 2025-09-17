'use client';

import { useState } from 'react';
import { X, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PromotionalBannerProps {
  message: string;
  onDismiss?: () => void;
}

export default function PromotionalBanner({ message, onDismiss }: PromotionalBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) {
    return null;
  }

  return (
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
            onClick={handleDismiss}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 