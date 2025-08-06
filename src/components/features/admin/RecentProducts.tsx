import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Eye } from 'lucide-react';
import { getAllProducts } from '@/features/products/queries/getAllProducts';

export default async function RecentProducts() {
  const result = await getAllProducts({
    limit: 5,
    page: 1,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const products = result.success ? result.data || [] : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Products</CardTitle>
            <CardDescription>Latest products added to your catalog</CardDescription>
          </div>
          <Link 
            href="/admin/products" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No products found</p>
            <p className="text-sm">Add your first product to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-center space-x-4">
                <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0].path}
                      alt={product.images[0].alt || product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium truncate">{product.name}</h4>
                    {product.brand && (
                      <Badge variant="secondary" className="text-xs">
                        {product.brand}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ${product.price?.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Added {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <Link 
                  href={`/admin/products/${product.id}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 