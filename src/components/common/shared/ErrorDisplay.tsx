'use client';

import { X, AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorDisplayProps {
  error?: string;
  type?: 'error' | 'warning' | 'info';
  className?: string;
}

export default function ErrorDisplay({ 
  error, 
  type = 'error',
  className = "" 
}: ErrorDisplayProps) {
  if (!error) return null;

  const getStyles = () => {
    switch (type) {
      case 'warning':
        return {
          card: 'border-amber-200 bg-amber-50',
          icon: 'text-amber-600',
          text: 'text-amber-700',
          iconComponent: AlertTriangle
        };
      case 'info':
        return {
          card: 'border-primary/20 bg-primary/5',
          icon: 'text-primary',
          text: 'text-primary',
          iconComponent: Info
        };
      default:
        return {
          card: 'border-destructive/20 bg-destructive/5',
          icon: 'text-destructive',
          text: 'text-destructive',
          iconComponent: X
        };
    }
  };

  const styles = getStyles();
  const IconComponent = styles.iconComponent;

  return (
    <Card className={`${styles.card} ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center">
          <IconComponent className={`w-4 h-4 mr-2 ${styles.icon}`} />
          <span className={`text-sm font-medium ${styles.text}`}>
            {error}
          </span>
        </div>
      </CardContent>
    </Card>
  );
} 