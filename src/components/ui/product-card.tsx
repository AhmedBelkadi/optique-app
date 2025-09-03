import { Product } from "@/features/products/schema/productSchema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className = "" }: ProductCardProps) {
  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/30 h-full flex flex-col ${className}`}>
      <CardHeader className="p-0 flex-shrink-0">
        <div className="aspect-square bg-muted rounded-t-lg overflow-hidden relative">
          {product.images && product.images.length > 0 && product.images[0].path ? (
            <Image
              src={product.images[0].path}
              alt={product.images[0].alt || product.name}
              width={400}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-24 h-24 text-muted-foreground/60" />
            </div>
          )}
          
          {/* Category Badge */}
          {product.categories && product.categories.length > 0 && (
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="bg-background/90 text-foreground border-border text-xs">
                {product.categories[0].name}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                {product.description}
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">
                {product.price ? `${product.price} MAD` : 'Sur demande'}
              </span>
            </div>
            
            <Button asChild size="sm" variant="outline" className="h-10 px-4">
              <Link href={`/products/${product.id}`}>
                <Eye className="w-4 h-4 mr-2" />
                Voir
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
