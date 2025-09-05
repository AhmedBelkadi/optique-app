'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  ZoomIn, 
  ZoomOut,
  RotateCw,
  Download,
  Share2,
  Package
} from 'lucide-react';
import Image from 'next/image';

interface ProductImage {
  id: string;
  path: string;
  alt?: string | null;
}

interface MobileProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function MobileProductGallery({ images, productName }: MobileProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Touch handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isZoomed) return;
    
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isZoomed) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = startX - currentX;
    const diffY = startY - currentY;
    
    // Only handle horizontal swipes
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging || isZoomed) return;
    
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
    
    setIsDragging(false);
  };

  // Mouse handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isZoomed) return;
    
    setIsDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isZoomed) return;
    
    const diffX = startX - e.clientX;
    if (Math.abs(diffX) > 50) {
      e.preventDefault();
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || isZoomed) return;
    
    const diffX = startX - e.clientX;
    
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
    
    setIsDragging(false);
  };

  // Navigation functions
  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    resetZoom();
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    resetZoom();
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
    resetZoom();
  };

  // Zoom functions
  const handleZoom = (direction: 'in' | 'out') => {
    const newScale = direction === 'in' ? scale * 1.5 : scale / 1.5;
    const clampedScale = Math.max(0.5, Math.min(3, newScale));
    setScale(clampedScale);
    setIsZoomed(clampedScale > 1);
    
    if (clampedScale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsZoomed(false);
  };

  // Pinch to zoom
  const handlePinchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setStartX(distance);
    }
  };

  const handlePinchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleChange = distance / startX;
      const newScale = Math.max(0.5, Math.min(3, scale * scaleChange));
      setScale(newScale);
      setIsZoomed(newScale > 1);
    }
  };

  // Fullscreen functions
  const openFullscreen = () => {
    setIsFullscreen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    document.body.style.overflow = 'unset';
    resetZoom();
  };

  // Share function
  const shareImage = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${productName} - Image ${currentIndex + 1}`,
          text: `Découvrez ${productName}`,
          url: window.location.href
        });
      } catch (error) {
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        switch (e.key) {
          case 'Escape':
            closeFullscreen();
            break;
          case 'ArrowLeft':
            prevImage();
            break;
          case 'ArrowRight':
            nextImage();
            break;
          case '+':
          case '=':
            handleZoom('in');
            break;
          case '-':
            handleZoom('out');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, currentIndex, scale]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-xl flex flex-col items-center justify-center border border-border">
        <Package className="w-16 h-16 md:w-32 md:h-32 text-muted-foreground/40 mb-4" />
        <p className="text-muted-foreground text-center text-sm md:text-base">Aucune image disponible</p>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <>
      {/* Mobile Gallery */}
      <div className="md:hidden space-y-4">
        {/* Main Image */}
        <div className="relative group">
          <div 
            ref={containerRef}
            className="aspect-square bg-muted rounded-xl overflow-hidden shadow-lg border border-border relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => setIsDragging(false)}
          >
            <Image
              ref={imageRef}
              src={currentImage.path}
              alt={currentImage.alt || productName}
              width={600}
              height={600}
              className="w-full h-full object-cover transition-transform duration-300 cursor-zoom-in"
              style={{
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                transformOrigin: 'center center'
              }}
              onDoubleClick={() => handleZoom('in')}
              onTouchStart={handlePinchStart}
              onTouchMove={handlePinchMove}
              priority
            />
            
            {/* Image Overlay with Actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-xl">
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="rounded-full w-8 h-8 p-0"
                  onClick={openFullscreen}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="rounded-full w-8 h-8 p-0"
                  onClick={shareImage}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full w-8 h-8 p-0 bg-black/50 hover:bg-black/70 text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full w-8 h-8 p-0 bg-black/50 hover:bg-black/70 text-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
            
            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
        
        {/* Thumbnail Gallery */}
        {images.length > 1 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Voir plus de photos</h3>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentIndex 
                      ? 'border-primary' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Image
                    src={image.path}
                    alt={image.alt || `${productName} ${index + 1}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Gallery */}
      <div className="hidden md:block space-y-6">
        {/* Main Image */}
        <div className="relative group">
          <div className="aspect-square bg-muted rounded-xl overflow-hidden shadow-lg border border-border">
            <Image
              src={currentImage.path}
              alt={currentImage.alt || productName}
              width={600}
              height={600}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
              onClick={openFullscreen}
              priority
            />
          </div>
          
          {/* Image Overlay with Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-xl">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button size="sm" variant="secondary" className="rounded-full w-10 h-10 p-0">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
              {images.length} photos
            </div>
          )}
        </div>
        
        {/* Thumbnail Gallery */}
        {images.length > 1 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Voir plus de photos</h3>
            <div className="grid grid-cols-5 gap-3">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => goToImage(index)}
                  className={`aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer transition-all duration-200 border-2 hover:border-primary/50 ${
                    index === currentIndex ? 'border-primary' : 'border-border'
                  }`}
                >
                  <Image
                    src={image.path}
                    alt={image.alt || `${productName} ${index + 1}`}
                    width={120}
                    height={120}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-black/80 text-white">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">{productName}</h2>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {currentIndex + 1} / {images.length}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleZoom('out')}
                className="text-white hover:bg-white/20"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleZoom('in')}
                className="text-white hover:bg-white/20"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetZoom}
                className="text-white hover:bg-white/20"
              >
                <RotateCw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={shareImage}
                className="text-white hover:bg-white/20"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeFullscreen}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Image Container */}
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="relative max-w-full max-h-full">
              <Image
                src={currentImage.path}
                alt={currentImage.alt || productName}
                width={800}
                height={800}
                className="max-w-full max-h-full object-contain"
                style={{
                  transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                  transformOrigin: 'center center'
                }}
                onDoubleClick={() => handleZoom('in')}
                onTouchStart={handlePinchStart}
                onTouchMove={handlePinchMove}
              />
            </div>
          </div>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </>
          )}

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="p-4 bg-black/80">
              <div className="flex gap-2 justify-center overflow-x-auto scrollbar-hide">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => goToImage(index)}
                    className={`flex-shrink-0 w-12 h-12 rounded overflow-hidden border-2 transition-all duration-200 ${
                      index === currentIndex 
                        ? 'border-white' 
                        : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    <Image
                      src={image.path}
                      alt={image.alt || `${productName} ${index + 1}`}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
