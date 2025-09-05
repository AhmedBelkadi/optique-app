'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, RefreshCw, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AboutError({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-xl">Erreur de chargement de la page À propos</CardTitle>
          <CardDescription>
            Nous avons rencontré une erreur lors du chargement de la page À propos. Veuillez réessayer.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              {error.message || 'Une erreur inattendue s\'est produite'}
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground font-mono">
                ID d'Erreur : {error.digest}
              </p>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <Button onClick={reset} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
            <Button variant="default" asChild className="w-full">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Link>
            </Button>
            <Button variant="default" asChild className="w-full">
              <Link href="/contact">
                <Home className="w-4 h-4 mr-2" />
                Nous contacter
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
