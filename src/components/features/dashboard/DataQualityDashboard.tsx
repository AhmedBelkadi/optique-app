import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Users, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Image,
  FolderOpen,
  Edit3,
  Globe
} from 'lucide-react';
import { getAllProducts } from '@/features/products/queries/getAllProducts';
import { getAllCustomers } from '@/features/customers/services/getAllCustomers';
import { getAllCategories } from '@/features/categories/services/getAllCategories';
import Link from 'next/link';

export default async function DataQualityDashboard() {
  // Fetch data for quality analysis
  const [productsResult, customersResult, categoriesResult] = await Promise.all([
    getAllProducts({ limit: 1000, page: 1 }),
    getAllCustomers({ limit: 1000, page: 1 }),
    getAllCategories(),
  ]);

  const products = productsResult.success && productsResult.data ? productsResult.data : [];
  const customers = customersResult.success && customersResult.data ? customersResult.data : [];
  const categories = categoriesResult.success && categoriesResult.data ? categoriesResult.data : [];

  // Product Quality Analysis
  const productQualityMetrics = {
    total: products.length,
    withImages: products.filter(p => p.images && p.images.length > 0).length,
    withCategories: products.filter(p => p.categories && p.categories.length > 0).length,
    withBrand: products.filter(p => p.brand && p.brand.trim().length > 0).length,
    withGoodDescription: products.filter(p => p.description && p.description.trim().length >= 20).length,
  };

  const productCompleteness = productQualityMetrics.total > 0 
    ? Math.round(
        ((productQualityMetrics.withImages + productQualityMetrics.withCategories + 
          productQualityMetrics.withBrand + productQualityMetrics.withGoodDescription) / 
          (productQualityMetrics.total * 4)) * 100
      )
    : 0;

  // Customer Quality Analysis
  const customerQualityMetrics = {
    total: customers.length,
    withPhone: customers.filter(c => c.phone && c.phone.trim().length > 0).length,
    withAddress: customers.filter(c => c.address && c.address.trim().length > 0).length,
    withNotes: customers.filter(c => c.notes && c.notes.trim().length > 0).length,
  };

  const customerCompleteness = customerQualityMetrics.total > 0 
    ? Math.round(
        ((customerQualityMetrics.withPhone + customerQualityMetrics.withAddress + 
          customerQualityMetrics.withNotes) / (customerQualityMetrics.total * 3)) * 100
      )
    : 0;

  // Content Management Status
  const contentStatus = {
    categories: categories.length,
    products: products.length,
    customers: customers.length,
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  const getQualityIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4" />;
    if (score >= 60) return <Clock className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Qualité des Données</h2>
          <p className="text-muted-foreground">Surveillez la qualité et la complétude de vos données</p>
        </div>
      </div>

      {/* Quality Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Product Quality */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Qualité Produits</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Complétude</span>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getQualityColor(productCompleteness)}`}
                >
                  {getQualityIcon(productCompleteness)}
                  <span className="ml-1">{productCompleteness}%</span>
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${productCompleteness}%` }}
                ></div>
              </div>
              
              {productQualityMetrics.total > 0 ? (
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Images: {productQualityMetrics.withImages}/{productQualityMetrics.total}</span>
                    <span>{Math.round((productQualityMetrics.withImages / productQualityMetrics.total) * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Catégories: {productQualityMetrics.withCategories}/{productQualityMetrics.total}</span>
                    <span>{Math.round((productQualityMetrics.withCategories / productQualityMetrics.total) * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Marques: {productQualityMetrics.withBrand}/{productQualityMetrics.total}</span>
                    <span>{Math.round((productQualityMetrics.withBrand / productQualityMetrics.total) * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Descriptions: {productQualityMetrics.withGoodDescription}/{productQualityMetrics.total}</span>
                    <span>{Math.round((productQualityMetrics.withGoodDescription / productQualityMetrics.total) * 100)}%</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">Aucun produit enregistré</p>
                  <Link 
                    href="/admin/products/new"
                    className="text-xs text-primary hover:underline mt-1 inline-block"
                  >
                    Ajouter votre premier produit
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Customer Quality */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Qualité Clients</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Complétude</span>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getQualityColor(customerCompleteness)}`}
                >
                  {getQualityIcon(customerCompleteness)}
                  <span className="ml-1">{customerCompleteness}%</span>
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${customerCompleteness}%` }}
                ></div>
              </div>
              
              {customerQualityMetrics.total > 0 ? (
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Téléphone: {customerQualityMetrics.withPhone}/{customerQualityMetrics.total}</span>
                    <span>{Math.round((customerQualityMetrics.withPhone / customerQualityMetrics.total) * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Adresse: {customerQualityMetrics.withAddress}/{customerQualityMetrics.total}</span>
                    <span>{Math.round((customerQualityMetrics.withAddress / customerQualityMetrics.total) * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Notes: {customerQualityMetrics.withNotes}/{customerQualityMetrics.total}</span>
                    <span>{Math.round((customerQualityMetrics.withNotes / customerQualityMetrics.total) * 100)}%</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">Aucun client enregistré</p>
                  <Link 
                    href="/admin/customers/new"
                    className="text-xs text-primary hover:underline mt-1 inline-block"
                  >
                    Ajouter votre premier client
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content Status */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Statut Contenu</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FolderOpen className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Catégories</span>
                  </div>
                  <Badge variant="secondary">{contentStatus.categories}</Badge>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Produits</span>
                  </div>
                  <Badge variant="secondary">{contentStatus.products}</Badge>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Clients</span>
                  </div>
                  <Badge variant="secondary">{contentStatus.customers}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      {(productCompleteness < 80 || customerCompleteness < 80) && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Actions Recommandées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {productCompleteness < 80 && (
                <div className="flex items-center space-x-3">
                  <Package className="h-4 w-4 text-amber-600" />
                  <span className="text-sm text-amber-700">
                    Améliorez la qualité des produits: ajoutez des images, catégories et descriptions
                  </span>
                  <Link href="/admin/products" className="text-xs text-amber-600 hover:text-amber-800 underline">
                    Gérer les produits
                  </Link>
                </div>
              )}
              
              {customerCompleteness < 80 && (
                <div className="flex items-center space-x-3">
                  <Users className="h-4 w-4 text-amber-600" />
                  <span className="text-sm text-amber-700">
                    Complétez les informations clients: téléphone, adresse et notes
                  </span>
                  <Link href="/admin/customers" className="text-xs text-amber-600 hover:text-amber-800 underline">
                    Gérer les clients
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
