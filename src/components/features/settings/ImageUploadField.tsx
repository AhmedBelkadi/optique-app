'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ImageUploadFieldProps {
  label: string;
  value?: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  accept?: string;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  placeholder = "Enter image URL or upload file",
  accept = "image/*"
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setImageError(false);
    
    try {
      // For now, we'll just create a local URL
      // In a real implementation, you'd upload to your server
      const url = URL.createObjectURL(file);
      onChange(url);
    } catch (error) {
      console.error('Error uploading image:', error);
      setImageError(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(false);
    onChange(event.target.value);
  };

  const clearImage = () => {
    onChange('');
    setImageError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isBlobUrl = (url: string) => {
    return url.startsWith('blob:');
  };

  const canDisplayImage = value && !imageError && (isValidUrl(value) || isBlobUrl(value));

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder={placeholder}
          value={value || ''}
          onChange={handleUrlChange}
          className="flex-1"
        />
        
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          {isUploading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Upload
        </Button>
        
        {value && (
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={clearImage}
            className="text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Image Preview */}
      {value && (
        <div className="space-y-2">
          <div className="relative w-32 h-32 border rounded-lg overflow-hidden bg-muted">
            {canDisplayImage ? (
              <>
                {isBlobUrl(value) ? (
                  // For blob URLs, use a regular img tag instead of Next.js Image
                  <img
                    src={value}
                    alt={label}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // For regular URLs, use regular img tag
                  <img
                    src={value}
                    alt={label}
                    className="w-full h-full object-cover"
                  />
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
          
          {imageError && (
            <p className="text-sm text-destructive">
              Failed to load image. Please check the URL or try uploading a different file.
            </p>
          )}
          
          {value && !imageError && (
            <p className="text-xs text-muted-foreground">
              {isBlobUrl(value) ? 'Local file uploaded' : 'External URL'}
            </p>
          )}
        </div>
      )}
    </div>
  );
} 