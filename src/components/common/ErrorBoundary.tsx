'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-muted/50 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <div className="text-destructive text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Quelque chose s'est mal passé
            </h1>
            <p className="text-muted-foreground mb-6">
              Nous sommes désolés, mais quelque chose d'inattendu s'est produit. Veuillez essayer d'actualiser la page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Actualiser la Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 