'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { RefreshCw, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { manualSyncReviewsAction } from '@/features/testimonials/actions/manualSyncReviews';
import { useCSRF } from '@/components/common/CSRFProvider';
import { Badge } from '@/components/ui/badge';

interface SyncStatus {
  hasGoogleConfig: boolean;
  hasFacebookConfig: boolean;
  total: number;
  synced: number;
  lastSynced: string | null;
}

export default function SyncButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const { csrfToken, isLoading: csrfLoading, error: csrfError } = useCSRF();

  // Fetch sync status on component mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/testimonials/sync-status');
        if (response.ok) {
          const data = await response.json();
          setSyncStatus(data);
        }
      } catch (error) {
        console.error('Failed to fetch sync status:', error);
      }
    };

    fetchStatus();
  }, []);

  const handleSync = async () => {
    if (csrfLoading) {
      toast.error('Le jeton de sécurité est encore en cours de chargement. Veuillez patienter.');
      return;
    }

    if (csrfError) {
      toast.error('Erreur du jeton de sécurité. Veuillez actualiser la page.');
      return;
    }

    if (!csrfToken) {
      toast.error('Jeton de sécurité non disponible. Veuillez actualiser la page.');
      return;
    }

    // Check if any external APIs are configured
    if (syncStatus && !syncStatus.hasGoogleConfig && !syncStatus.hasFacebookConfig) {
      toast.error('Aucune API externe configurée. Veuillez configurer Google Places ou Facebook API.');
      return;
    }

    setIsLoading(true);
    try {
      // Create FormData for the action
      const formData = new FormData();
      formData.append('csrf_token', csrfToken);
      
      const result = await manualSyncReviewsAction(null, formData);
      
      if (result.success) {
        toast.success(result.message || 'Synchronisation terminée avec succès !');
        
        // Show detailed results
        if (result.data) {
          const { totalSynced, google, facebook } = result.data;
          if (totalSynced > 0) {
            toast.success(
              `Détails: ${totalSynced} témoignages synchronisés (Google: ${google.synced}, Facebook: ${facebook.synced})`,
              { duration: 5000 }
            );
          }
        }
        
        // Refresh sync status
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(result.error || 'Échec de la synchronisation');
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Une erreur inattendue est survenue lors de la synchronisation');
    } finally {
      setIsLoading(false);
    }
  };

  if (csrfLoading) {
    return (
      <Button variant="default" disabled className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Chargement...
      </Button>
    );
  }

  if (csrfError) {
    return (
      <Button variant="default" disabled className="flex items-center gap-2 text-destructive">
        Erreur CSRF
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Configuration Status */}
      {syncStatus && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Configuration:</span>
          <Badge 
            variant={syncStatus.hasGoogleConfig ? "default" : "secondary"}
            className="text-xs"
          >
            {syncStatus.hasGoogleConfig ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Google
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3 mr-1" />
                Google
              </>
            )}
          </Badge>
          <Badge 
            variant={syncStatus.hasFacebookConfig ? "default" : "secondary"}
            className="text-xs"
          >
            {syncStatus.hasFacebookConfig ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Facebook
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3 mr-1" />
                Facebook
              </>
            )}
          </Badge>
        </div>
      )}

      {/* Sync Button */}
      <Button
        onClick={handleSync}
        disabled={isLoading || (!syncStatus?.hasGoogleConfig && !syncStatus?.hasFacebookConfig)}
        variant="default"
        className="flex items-center gap-2"
        title={
          !syncStatus?.hasGoogleConfig && !syncStatus?.hasFacebookConfig
            ? "Configurez au moins une API externe pour activer la synchronisation"
            : "Synchroniser les avis externes"
        }
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
        {isLoading ? 'Synchronisation...' : 'Synchroniser les avis'}
      </Button>

      {/* Sync Info */}
      {syncStatus && (
        <div className="text-xs text-muted-foreground">
          {syncStatus.lastSynced ? (
            <span>Dernière sync: {new Date(syncStatus.lastSynced).toLocaleDateString()}</span>
          ) : (
            <span>Aucune synchronisation effectuée</span>
          )}
        </div>
      )}
    </div>
  );
}
