'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical, 
  Tag, 
  Package,
  Clock,
  Hash
} from 'lucide-react';
import { Product } from '@/features/products/schema/productSchema';
import { DynamicDeleteProductModal } from '@/components/common/DynamicImport';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDateShort } from '@/lib/shared/utils/dateUtils';

interface ProductGridProps {
  products: Product[];
  onDelete?: (productId: string) => void;
}

const ProductGrid = React.memo(({ products, onDelete }: ProductGridProps) => {
  const [selectedProductToDelete, setSelectedProductToDelete] = useState<Product | null>(null);

  if (products.length === 0) {
    return (
             <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
        <CardContent className="p-16 text-center">
          <div className="mx-auto h-20 w-20 text-muted-foreground mb-6">
            <Package className="w-full h-full" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">No products found</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
            Get started by creating your first product to showcase your optical collection.
          </p>
          <Link href="/admin/products/new">
                         <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-200">
              <Package className="w-4 h-4 mr-2" />
              Create First Product
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <Card
          key={product.id}
                     className="group relative overflow-hidden rounded-xl border-0 shadow-sm bg-background/50 backdrop-blur-sm hover:shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          {/* Image Section */}
                     <div className="relative aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
            {product.images?.[0] ? (
              <Image
                src={product.images[0].path}
                alt={product.images[0].alt || product.name}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                quality={85}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <Package className="w-12 h-12" />
              </div>
            )}

            {/* Price Badge */}
            <div className="absolute top-3 right-3">
              <Badge className="bg-emerald-500/90 backdrop-blur-sm text-primary-foreground font-semibold text-sm px-3 py-1.5 shadow-lg border-0">
                {product.price.toFixed(2)} MAD
              </Badge>
            </div>

            {/* Quick Actions Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex space-x-2">
                                 <Link href={`/admin/products/${product.id}`}>
                   <Button size="sm" className="bg-background/90 hover:bg-background text-foreground shadow-lg">
                     <Eye className="w-4 h-4" />
                   </Button>
                 </Link>

                 <Link href={`/admin/products/${product.id}/edit`}>
                   <Button size="sm" className="bg-background/90 hover:bg-background text-foreground shadow-lg">
                     <Edit className="w-4 h-4" />
                   </Button>
                 </Link>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <CardContent className="p-5">
            {/* Header with Title and Menu */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground truncate leading-tight">
                  {product.name}
                </h3>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/products/${product.id}`} className="flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      Voir les Détails
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/products/${product.id}/edit`} className="flex items-center">
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier le Produit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedProductToDelete(product)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                                          Supprimer le Produit
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Product Details */}
            <div className="space-y-2 mb-4">
              {product.brand && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Tag className="w-3 h-3 text-muted-foreground/60" />
                  <span className="truncate">
                    <span className="font-medium text-muted-foreground">Marque :</span> {product.brand}
                  </span>
                </div>
              )}
              {product.reference && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Hash className="w-3 h-3 text-muted-foreground/60" />
                  <span className="truncate">
                    <span className="font-medium text-muted-foreground">Référence :</span> {product.reference}
                  </span>
                </div>
              )}
            </div>

            {/* Categories */}
            {product.categories?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {product.categories.slice(0, 2).map((category) => (
                  <Badge
                    key={category.id}
                    variant="secondary"
                    className="px-2.5 py-1 text-xs bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    {category.name}
                  </Badge>
                ))}
                {product.categories.length > 2 && (
                  <Badge 
                    variant="secondary" 
                    className="px-2.5 py-1 text-xs bg-muted text-muted-foreground border border-border"
                  >
                    +{product.categories.length - 2} autres
                  </Badge>
                )}
              </div>
            )}

            {/* Creation Date */}
            <div className="flex items-center text-xs text-muted-foreground mb-4">
              <Clock className="w-3 h-3 mr-1.5 text-muted-foreground/60" />
              <span>Créé le {formatDateShort(product.createdAt)}</span>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex space-x-1">
                <Link href={`/admin/products/${product.id}`}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                    title="Voir les Détails"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>

                <Link href={`/admin/products/${product.id}/edit`}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                    title="Modifier le Produit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedProductToDelete(product)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                title="Delete Product"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Conditional modal rendering */}
      {selectedProductToDelete && (
        <DynamicDeleteProductModal
          product={selectedProductToDelete}
          onSuccess={() => {
            onDelete?.(selectedProductToDelete.id);
            setSelectedProductToDelete(null);
          }}
          onClose={() => setSelectedProductToDelete(null)}
        />
      )}
    </div>
  );
});

ProductGrid.displayName = 'ProductGrid';
export default ProductGrid;
