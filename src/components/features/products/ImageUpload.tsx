'use client';

import { useState, useRef } from 'react';
import { validateImage, validateImageCount } from '@/lib/shared/utils/imageUpload';

interface ImageFile {
  id: string;
  file?: File; // Only for new images
  preview: string;
  alt: string;
  existing?: boolean;
  serverId?: string;
}

interface ImageUploadProps {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 10 
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    setError('');

    const fileArray = Array.from(files);
    const newImages: ImageFile[] = [];

    for (const file of fileArray) {
      // Check if we've reached the maximum
      if (images.length + newImages.length >= maxImages) {
        setError(`Maximum ${maxImages} images autorisées.`);
        break;
      }

      // Validate individual image
      const validation = validateImage(file);
      if (!validation.isValid) {
        setError(validation.error!);
        continue;
      }

      // Create preview URL
      const preview = URL.createObjectURL(file);
      const id = Math.random().toString(36).substr(2, 9);
      
      newImages.push({
        id,
        file,
        preview,
        alt: `${file.name} - Image ${images.length + newImages.length + 1}`,
      });
    }

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
    }
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
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const removeImage = (id: string) => {
    const imageToRemove = images.find(img => img.id === id);
    if (imageToRemove && imageToRemove.file && !imageToRemove.existing) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    onImagesChange(images.filter(img => img.id !== id));
    setError('');
  };

  const updateImageAlt = (id: string, alt: string) => {
    onImagesChange(images.map(img => 
      img.id === id ? { ...img, alt } : img
    ));
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-foreground">
          Images du Produit ({images.length}/{maxImages})
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={images.length >= maxImages}
          className="text-sm text-primary hover:text-primary disabled:text-muted-foreground/60 disabled:cursor-not-allowed"
        >
          + Ajouter des Images
        </button>
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Upload Area */}
      {images.length === 0 && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-indigo-500 bg-primary/10' 
              : 'border-border hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-muted-foreground/60 mb-4">
            <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">
            Glissez et déposez des images ici, ou{' '}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-primary hover:text-primary"
            >
              parcourir
            </button>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            PNG, JPG, WebP jusqu'à 5MB chacun
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-destructive text-sm bg-destructive/5 p-3 rounded-md">
          {error}
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img
                  src={image.preview}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Image Controls */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="bg-destructive text-primary-foreground p-2 rounded-full hover:bg-destructive/90 transition-colors"
                                         title="Supprimer l'image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => reorderImages(index, index - 1)}
                      className="bg-muted text-primary-foreground p-2 rounded-full hover:bg-muted transition-colors"
                                             title="Déplacer vers la gauche"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  
                  {index < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => reorderImages(index, index + 1)}
                      className="bg-muted text-primary-foreground p-2 rounded-full hover:bg-muted transition-colors"
                      title="Déplacer vers la droite"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Image Order Badge */}
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-primary-foreground text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add More Button */}
      {images.length > 0 && images.length < maxImages && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
                         Ajouter Plus d'Images
          </button>
        </div>
      )}
    </div>
  );
} 