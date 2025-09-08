import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatDateShort } from '@/lib/shared/utils/dateUtils';
import { getAllProducts } from '@/features/products/queries/getAllProducts';

export default async function RecentProducts() {
  const result = await getAllProducts({
    limit: 5,
    page: 1,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const products = result.success ? (result as any).data || [] : [];

  const getProductHealthScore = (product: any) => {
    let score = 100;
    let issues: string[] = [];

    // Check for images
    if (!product.images || product.images.length === 0) {
      score -= 30;
      issues.push('Pas d\'images');
    }

    // Check for categories
    if (!product.categories || product.categories.length === 0) {
      score -= 25;
      issues.push('Pas de catégories');
    }

    // Check for description
    if (!product.description || product.description.trim().length < 10) {
      score -= 15;
      issues.push('Description courte');
    }

    // Check for brand
    if (!product.brand) {
      score -= 10;
      issues.push('Pas de marque');
    }

    return { score: Math.max(0, score), issues };
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  const getHealthIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Produits Récents</CardTitle>
            <CardDescription>Derniers produits ajoutés à votre catalogue</CardDescription>
          </div>
          <Link 
            href="/admin/products" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Voir tout
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg font-medium mb-2">Aucun produit trouvé</p>
            <p className="text-sm mb-4">Ajoutez votre premier produit pour commencer</p>
            <Link 
              href="/admin/products/new"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <Package className="h-4 w-4 mr-2" />
              Ajouter un produit
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product: any) => {
              const health = getProductHealthScore(product);
              return (
                <div key={product.id} className="flex items-center space-x-4 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                  <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].path}
                        alt={product.images[0].alt || product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Product image failed to load:', product.images[0].path);
                          e.currentTarget.style.display = 'none';
                        }}
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
                      {product.price?.toFixed(2) || '0.00'} MAD
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Ajouté le {formatDateShort(product.createdAt)}
                    </p>
                    
                    {/* Health Score */}
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getHealthColor(health.score)}`}
                      >
                        {getHealthIcon(health.score)}
                        <span className="ml-1">Score: {health.score}%</span>
                      </Badge>
                      {health.issues.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {health.issues.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Link 
                    href={`/admin/products/${product.id}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 