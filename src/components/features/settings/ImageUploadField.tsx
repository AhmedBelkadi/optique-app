'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // For now, we'll just create a local URL
      // In a real implementation, you'd upload to your server
      const url = URL.createObjectURL(file);
      onChange(url);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const clearImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
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
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4" />
        </Button>
        
        {value && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearImage}
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

      {value && (
        <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
          <Image
            src={value}
            alt={label}
            fill
            className="object-cover"
            onError={(e) => {
              // Handle image load error
              console.error('Image failed to load:', value);
            }}
          />
        </div>
      )}
    </div>
  );
} 