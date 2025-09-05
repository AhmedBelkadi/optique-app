'use client';

import { useState, useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

interface ImageUploadProps {
  label: string;
  value?: string | null;
  onChange: (value: string) => void;
  onFileChange?: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  folder?: string; // Upload folder for organization
}

export default function ImageUpload({
  label,
  value,
  onChange,
  onFileChange,
  accept = "image/*",
  maxSize = 5, // 5MB default
  className,
  folder = "settings" // Default folder for settings uploads
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('❌ Invalid file type - Please select an image file (JPG, PNG, GIF, WebP)', {
        duration: 5000,
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca'
        }
      });
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`❌ File too large - Maximum file size is ${maxSize}MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB`, {
        duration: 5000,
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca'
        }
      });
      return;
    }

    // Create preview URL for immediate display
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    // Store the file for later upload when form is submitted
    if (onFileChange) {
      onFileChange(file);
    }

    // Show success message for preview
    toast.success('✅ Image selected! Click "Save Site Settings" to upload and save', {
      duration: 4000,
      style: {
        background: '#f0fdf4',
        color: '#16a34a',
        border: '1px solid #bbf7d0'
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };



  const handleRemove = () => {
    onChange('');
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Clean up the object URL to prevent memory leaks
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Label className="text-sm font-medium text-foreground">{label}</Label>
          {value && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-green-200">
                <img
                  src={value}
                  alt="Current"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Current image</span>
              </div>
            </div>
          )}
        </div>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
          >
            Remove
          </Button>
        )}
      </div>

      {/* Upload Area */}
      <Card 
        className={cn(
          "border-2 border-dashed transition-all duration-200 cursor-pointer group",
          isDragOver 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : previewUrl
              ? "border-primary/30 bg-primary/5 hover:border-primary/50"
              : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/30"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <CardContent className="p-8">
          {previewUrl ? (
            <div className="space-y-4">
              <div className="relative group/image">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden border-2 border-primary/20">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain transition-transform duration-200 group-hover/image:scale-105"
                  />
                </div>
                
                {/* Hover overlay with actions */}
                <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openFileDialog();
                      }}
                      className="bg-white/90 text-black hover:bg-white"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Change
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove();
                      }}
                      className="bg-red-500/90 text-white hover:bg-red-500"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
              
                             <div className="text-center">
                 <p className="text-sm text-muted-foreground">
                   Click to change image or drag & drop a new one
                 </p>
                 <p className="text-xs text-muted-foreground/70 mt-1">
                   Supported: JPG, PNG, GIF, WebP • Max: {maxSize}MB
                 </p>
                 <p className="text-xs text-blue-600 mt-2 font-medium">
                   💡 Image will be uploaded when you save settings
                 </p>
               </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <ImageIcon className="w-8 h-8 text-primary" />
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-lg font-medium text-foreground">
                    {isDragOver ? 'Drop image here' : 'Upload an image'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isDragOver 
                      ? 'Release to upload' 
                      : 'Drag & drop or click to browse'
                    }
                  </p>
                </div>
                
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/70">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <span>JPG, PNG, GIF, WebP</span>
                  </div>
                  <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <span>Max {maxSize}MB</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Upload Button - Only show when no image */}
      {!previewUrl && (
        <Button
          type="button"
          variant="default"
          onClick={openFileDialog}
          disabled={isUploading}
          className="w-full h-12 text-base font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
        >
          {isUploading ? (
            <>
              <div className="w-5 h-5 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Uploading...
            </>
          ) : (
                         <>
               <Upload className="w-5 h-5 mr-2" />
               Select Image
             </>
          )}
        </Button>
        )}
    </div>
  );
}
