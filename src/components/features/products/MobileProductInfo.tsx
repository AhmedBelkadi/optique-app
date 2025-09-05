'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronDown, 
  ChevronUp,
  MessageCircle,
  Star,
  Tag,
  Building,
  Calendar,
  Package,
  Share2,
  Heart,
  Eye,
  Info
} from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  reference?: string | null;
  brand?: string | null;
  categories: Category[];
  createdAt: string;
  isDeleted: boolean;
}

interface MobileProductInfoProps {
  product: Product;
}

export function MobileProductInfo({ product }: MobileProductInfoProps) {
  const [expandedSections, setExpandedSections] = useState({
    description: false,
    details: false,
    specifications: false
  });

  const [isFavorited, setIsFavorited] = useState(false);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    // Here you would typically call an API to save/remove from favorites
  };

  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description || `Découvrez ${product.name}`,
          url: window.location.href
        });
      } catch (error) {
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="space-y-6">
      {/* Product Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
              {product.name}
            </h1>
            {product.reference && (
              <p className="text-sm text-muted-foreground mt-1 font-mono">
                Réf: {product.reference}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFavorite}
              className={`h-10 w-10 p-0 ${isFavorited ? 'text-red-500' : 'text-muted-foreground'}`}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={shareProduct}
              className="h-10 w-10 p-0 text-muted-foreground"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Price Display */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Prix</p>
              <span className="text-3xl md:text-4xl font-bold text-primary">
                {product.price} MAD
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Statut</p>
              <Badge 
                variant={product.isDeleted ? "destructive" : "default"}
                className="text-xs"
              >
                {product.isDeleted ? 'Indisponible' : 'Disponible'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        {/* WhatsApp Contact Button */}
        <Button 
          size="lg" 
          className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12"
          asChild
        >
          <Link
            href={`https://wa.me/212606970209?text=Bonjour! Je suis intéressé par le produit: ${product.name} (${product.reference || 'N/A'}). Pouvez-vous me donner plus d'informations?`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Demander sur WhatsApp
          </Link>
        </Button>
        
        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="default" 
            size="lg"
            className="h-12"
            asChild
          >
            <Link href="/appointment">
              <Calendar className="w-4 h-4 mr-2" />
              Prendre RDV
            </Link>
          </Button>
        </div>
      </div>

      {/* Product Rating */}
      {/* <div className="flex items-center justify-center gap-2 py-3 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-warning fill-current" />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">5.0 (Excellent)</span>
      </div> */}

      {/* Collapsible Sections */}
      <div className="space-y-4">
        {/* Description Section */}
        {product.description && (
          <Card>
            <button
              onClick={() => toggleSection('description')}
              className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Info className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium text-foreground">Description</span>
              </div>
              {expandedSections.description ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            {expandedSections.description && (
              <CardContent className="pt-0 pb-4">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </CardContent>
            )}
          </Card>
        )}

        {/* Product Details Section */}
        <Card>
          <button
            onClick={() => toggleSection('details')}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium text-foreground">Détails du produit</span>
            </div>
            {expandedSections.details ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          {expandedSections.details && (
            <CardContent className="pt-0 pb-4 space-y-4">
              {/* Categories */}
              {product.categories && product.categories.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Catégories</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((category) => (
                      <Badge key={category.id} variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Brand */}
              {product.brand && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Marque</span>
                  </div>
                  <span className="font-medium text-foreground">{product.brand}</span>
                </div>
              )}

              {/* Reference */}
              {product.reference && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Référence</span>
                  </div>
                  <span className="font-mono text-sm bg-muted px-2 py-1 rounded border">
                    {product.reference}
                  </span>
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Additional Information Section */}
        <Card>
          <button
            onClick={() => toggleSection('specifications')}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium text-foreground">Informations supplémentaires</span>
            </div>
            {expandedSections.specifications ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          {expandedSections.specifications && (
            <CardContent className="pt-0 pb-4 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-muted/20 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ajouté le</p>
                      <p className="font-medium text-foreground">
                        {new Date(product.createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/20 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                      <Tag className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Statut</p>
                      <p className="font-medium text-foreground">
                        {product.isDeleted ? 'Indisponible' : 'Disponible'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-lg border border-primary/10">
        <h3 className="font-semibold text-foreground mb-2">Besoin d'aide ?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Nos experts optiques sont là pour vous conseiller et vous aider à choisir la paire parfaite.
        </p>
        <div className="flex gap-3">
          <Button 
            variant="success" 
            size="sm"
            className="flex-1 h-10"
            asChild
          >
            <Link href="/contact">
              Nous contacter
            </Link>
          </Button>
          <Button 
            size="sm"
            className="flex-1 h-10"
            asChild
          >
            <Link href="/appointment">
              Prendre RDV
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
