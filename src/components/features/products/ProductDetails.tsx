'use client';

import { useEffect, useRef, useActionState, useState, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Product } from '@/features/products/schema/productSchema';
import { formatDateShort } from '@/lib/shared/utils/dateUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Tag,
  DollarSign,
  Package,
  Hash,
  Clock
} from 'lucide-react';
import Image from 'next/image';

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="min-h-screen bg-muted/50">
      <div className=" py-4">
       
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images Section */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-primary" />
                  <span>Product Images</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {product.images && product.images.length > 0 ? (
                  <div className="space-y-4">
                    {/* Main Image Display */}
                    <div className="relative aspect-square bg-muted rounded-xl overflow-hidden shadow-lg">
                      <img
                        src={product.images[currentImageIndex].path}
                        alt={product.images[currentImageIndex].alt || `${product.name} - Image ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                     
                      />
                      
                      {/* Navigation Arrows */}
                      {product.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Thumbnail Navigation */}
                    {product.images.length > 1 && (
                      <div className="flex space-x-2 overflow-x-auto pb-2">
                        {product.images.map((image, index) => (
                          <button
                            key={image.id}
                            onClick={() => goToImage(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                              index === currentImageIndex
                                ? 'border-indigo-500 shadow-md'
                                : 'border-border hover:border-border'
                            }`}
                          >
                            <Image
                              src={image.path}
                              alt={image.alt || `${product.name} - Thumbnail ${index + 1}`}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Image Counter */}
                    <div className="text-center text-sm text-muted-foreground">
                      {currentImageIndex + 1} of {product.images.length}
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square bg-muted rounded-xl flex items-center justify-center">
                    <div className="text-center text-muted-foreground/60">
                      <Package className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">No images available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Header with Actions */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <Hash className="w-4 h-4" />
                    <span>ID: {product.id}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Updated {formatDateShort(product.updatedAt)}</span>
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              
              </div>
            </div>

            {/* Product Details Cards */}
            <div className="space-y-6">
              {/* Basic Information */}
              <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-primary" />
                    <span>Basic Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Price</label>
                      <div className="flex items-center space-x-1 mt-1">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        <span className="text-2xl font-bold text-foreground">
                          {product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    {product.brand && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Brand</label>
                        <p className="text-lg text-foreground mt-1">{product.brand}</p>
                      </div>
                    )}
                  </div>

                  {product.reference && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Reference</label>
                      <p className="text-lg text-foreground mt-1">{product.reference}</p>
                    </div>
                  )}

                  {product.description && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Description</label>
                      <p className="text-foreground mt-1 leading-relaxed">{product.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Categories */}
              <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Tag className="w-5 h-5 text-primary" />
                    <span>Categories</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {product.categories && product.categories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {product.categories.map((category) => (
                        <Badge
                          key={category.id}
                          variant="secondary"
                          className="px-3 py-1 text-sm bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                        >
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No categories assigned</p>
                  )}
                </CardContent>
              </Card>

              {/* Timestamps */}
              <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span>Timeline</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Created</span>
                    <span className="text-sm text-foreground">
                      {new Date(product.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="border-t border-border my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Updated</span>
                    <span className="text-sm text-foreground">
                      {new Date(product.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 