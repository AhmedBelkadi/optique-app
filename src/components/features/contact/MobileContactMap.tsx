'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, 
  Navigation, 
  ExternalLink,
  Maximize2,
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface MobileContactMapProps {
  googleMapEmbed?: string;
  address?: string;
  googleMapLink?: string;
  siteName?: string;
}

export function MobileContactMap({ 
  googleMapEmbed, 
  address, 
  googleMapLink,
  siteName 
}: MobileContactMapProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const openFullscreen = () => {
    setIsFullscreen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    document.body.style.overflow = 'unset';
  };

  const openInMaps = () => {
    if (googleMapLink) {
      window.open(googleMapLink, '_blank', 'noopener,noreferrer');
    } else if (address) {
      // Fallback: open Google Maps with address
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank', 'noopener,noreferrer');
    }
  };

  const getDirections = () => {
    if (googleMapLink) {
      // Extract coordinates from Google Maps link if possible
      const coordsMatch = googleMapLink.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (coordsMatch) {
        const [, lat, lng] = coordsMatch;
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank', 'noopener,noreferrer');
      } else {
        window.open(googleMapLink, '_blank', 'noopener,noreferrer');
      }
    } else if (address) {
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank', 'noopener,noreferrer');
    }
  };

  if (!googleMapEmbed && !address) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Localisation</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Notre boutique est située au cœur de notre ville, facilement accessible
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>📍 Centre-ville de notre ville</p>
              <p>🚗 Parking disponible</p>
              <p>🚌 Accessible en transport</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Mobile Map Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            {/* Map Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Notre Localisation</h3>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={openFullscreen}
                  className="h-8 w-8 p-0"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Map Container */}
            <div className="relative">
              <div className="h-48 md:h-64 bg-muted/30">
                {googleMapEmbed ? (
                  <iframe
                    src={googleMapEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Localisation ${siteName || 'nous'}`}
                    onLoad={() => setMapLoaded(true)}
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                      <MapPin className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Localisation</h4>
                    <p className="text-xs text-muted-foreground mb-3 max-w-xs">
                      Notre boutique est située au cœur de notre ville, facilement accessible
                    </p>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>📍 Centre-ville de notre ville</p>
                      <p>🚗 Parking disponible</p>
                      <p>🚌 Accessible en transport</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Map Overlay Controls */}
              {googleMapEmbed && (
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={openFullscreen}
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Loading Indicator */}
              {!mapLoaded && googleMapEmbed && (
                <div className="absolute inset-0 bg-muted/50 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Chargement de la carte...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={getDirections}
                  className="h-10 text-sm"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Itinéraire
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openInMaps}
                  className="h-10 text-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ouvrir
                </Button>
              </div>
              
              {address && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    📍 {address}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fullscreen Map Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-black/80 text-white">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Localisation {siteName || 'nous'}</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={getDirections}
                className="text-white hover:bg-white/20"
              >
                <Navigation className="w-4 h-4 mr-1" />
                Itinéraire
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={openInMaps}
                className="text-white hover:bg-white/20"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Ouvrir
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeFullscreen}
                className="text-white hover:bg-white/20"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1 relative">
            {googleMapEmbed && (
              <iframe
                src={googleMapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Localisation ${siteName || 'nous'} - Plein écran`}
              />
            )}
          </div>

          {/* Footer */}
          {address && (
            <div className="p-4 bg-black/80 text-white">
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4" />
                <p className="text-sm">{address}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
