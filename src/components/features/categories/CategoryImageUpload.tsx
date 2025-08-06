'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { validateImage } from '@/lib/shared/utils/imageUpload';

interface CategoryImageUploadProps {
  currentImage?: string | null;
  onImageChange: (file: File | null) => void;
}

export default function CategoryImageUpload({ 
  currentImage, 
  onImageChange 
}: CategoryImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>('');
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setPreview(null);
      onImageChange(null);
      return;
    }

    setError('');

    // Validate image
    const validation = validateImage(file);
    if (!validation.isValid) {
      setError(validation.error!);
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    onImageChange(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    if (preview && preview !== currentImage) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onImageChange(null);
    setError('');
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-foreground">
        Category Image
      </label>
      
      {/* Image Preview */}
      {preview && (
        <div className="relative">
          <div className="w-32 h-32 relative rounded-lg overflow-hidden border">
            <Image
              src={preview}
              alt="Category preview"
              fill
              className="object-cover"
            />
          </div>
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-destructive/90"
          >
            ×
          </button>
        </div>
      )}

      {/* Upload Area */}
      {!preview && (
        <div
          className={`w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-border/80'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-center">
            <div className="text-muted-foreground">
              <svg className="mx-auto h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground/60">PNG, JPG, WebP up to 5MB</p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 