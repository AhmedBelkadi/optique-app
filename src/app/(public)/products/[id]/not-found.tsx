import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Search, Home } from 'lucide-react';
import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl">Produit Non Trouvé</CardTitle>
          <CardDescription>
            Le produit que vous recherchez n'existe pas ou a été supprimé.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Le produit a peut-être été supprimé ou l'URL pourrait être incorrecte.
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/products">
                <Search className="w-4 h-4 mr-2" />
                Parcourir les Produits
              </Link>
            </Button>
            <Button variant="default" asChild className="w-full">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Aller à l'Accueil
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
