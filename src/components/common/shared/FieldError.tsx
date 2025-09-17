'use client';

import { X } from 'lucide-react';

interface FieldErrorProps {
  error?: string;
  className?: string;
}

export default function FieldError({ error, className = "" }: FieldErrorProps) {
  if (!error) return null;

  return (
    <p className={`text-sm text-destructive flex items-center ${className}`}>
      <X className="w-4 h-4 mr-1" />
      {error}
    </p>
  );
} 