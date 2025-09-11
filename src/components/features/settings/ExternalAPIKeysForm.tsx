'use client';

import { useState, useTransition } from 'react';
import { toast } from 'react-hot-toast';
import { Save, Eye, EyeOff, RefreshCw, TestTube, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCSRF } from '@/components/common/CSRFProvider';
import { updateExternalAPIKeysAction } from '@/features/settings/actions/updateExternalAPIKeysAction';
import { testGoogleAPIKeyAction } from '@/features/settings/actions/testGoogleAPIKeyAction';
import { testFacebookAPIKeyAction } from '@/features/settings/actions/testFacebookAPIKeyAction';

interface ExternalAPIKeysFormProps {
  initialSettings: {
    googlePlacesApiKey?: string;
    googlePlaceId?: string;
    facebookAccessToken?: string;
    facebookPageId?: string;
    enableGoogleSync?: boolean;
    enableFacebookSync?: boolean;
  };
}

export default function ExternalAPIKeysForm({ initialSettings }: ExternalAPIKeysFormProps) {
  const { csrfToken, isLoading: csrfLoading, error: csrfError } = useCSRF();
  const [isPending, startTransition] = useTransition();
  const [isTestingGoogle, setIsTestingGoogle] = useState(false);
  const [isTestingFacebook, setIsTestingFacebook] = useState(false);
  
  const [settings, setSettings] = useState({
    googlePlacesApiKey: initialSettings.googlePlacesApiKey || '',
    googlePlaceId: initialSettings.googlePlaceId || '',
    facebookAccessToken: initialSettings.facebookAccessToken || '',
    facebookPageId: initialSettings.facebookPageId || '',
    enableGoogleSync: initialSettings.enableGoogleSync ?? false,
    enableFacebookSync: initialSettings.enableFacebookSync ?? false,
  });

  const [showGoogleKey, setShowGoogleKey] = useState(false);
  const [showFacebookToken, setShowFacebookToken] = useState(false);

  const handleSave = async () => {
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

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('csrf_token', csrfToken);
        
        // Add all settings
        Object.entries(settings).forEach(([key, value]) => {
          formData.append(key, value.toString());
        });

        const result = await updateExternalAPIKeysAction(null, formData);
        
        if (result.success) {
          toast.success('Configuration des API externes mise à jour avec succès !');
        } else {
          toast.error(result.error || 'Échec de la mise à jour de la configuration');
        }
      } catch (error) {
        console.error('Save error:', error);
        toast.error('Une erreur inattendue est survenue');
      }
    });
  };

  const handleTestGoogle = async () => {
    if (!settings.googlePlacesApiKey || !settings.googlePlaceId) {
      toast.error('Veuillez d\'abord configurer la clé API Google et l\'ID du lieu');
      return;
    }

    if (csrfLoading || !csrfToken) {
      toast.error('Jeton de sécurité non disponible');
      return;
    }

    setIsTestingGoogle(true);
    try {
      const formData = new FormData();
      formData.append('csrf_token', csrfToken);
      formData.append('apiKey', settings.googlePlacesApiKey);
      formData.append('placeId', settings.googlePlaceId);

      const result = await testGoogleAPIKeyAction(null, formData);
      
      if (result.success) {
        toast.success('✅ Test Google API réussi ! La configuration est valide.');
      } else {
        toast.error(`❌ Test Google API échoué: ${result.error}`);
      }
    } catch (error) {
      console.error('Google API test error:', error);
      toast.error('Erreur lors du test de l\'API Google');
    } finally {
      setIsTestingGoogle(false);
    }
  };

  const handleTestFacebook = async () => {
    if (!settings.facebookAccessToken || !settings.facebookPageId) {
      toast.error('Veuillez d\'abord configurer le token d\'accès Facebook et l\'ID de la page');
      return;
    }

    if (csrfLoading || !csrfToken) {
      toast.error('Jeton de sécurité non disponible');
      return;
    }

    setIsTestingFacebook(true);
    try {
      const formData = new FormData();
      formData.append('csrf_token', csrfToken);
      formData.append('accessToken', settings.facebookAccessToken);
      formData.append('pageId', settings.facebookPageId);

      const result = await testFacebookAPIKeyAction(null, formData);
      
      if (result.success) {
        toast.success('✅ Test Facebook API réussi ! La configuration est valide.');
      } else {
        toast.error(`❌ Test Facebook API échoué: ${result.error}`);
      }
    } catch (error) {
      console.error('Facebook API test error:', error);
      toast.error('Erreur lors du test de l\'API Facebook');
    } finally {
      setIsTestingFacebook(false);
    }
  };

  const getGoogleStatus = () => {
    if (!settings.googlePlacesApiKey || !settings.googlePlaceId) return 'not-configured';
    if (!settings.enableGoogleSync) return 'disabled';
    return 'configured';
  };

  const getFacebookStatus = () => {
    if (!settings.facebookAccessToken || !settings.facebookPageId) return 'not-configured';
    if (!settings.enableFacebookSync) return 'disabled';
    return 'configured';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'configured':
        return <Badge variant="success" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Configuré</Badge>;
      case 'disabled':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Désactivé</Badge>;
      case 'not-configured':
        return <Badge variant="outline" className="text-muted-foreground"><AlertCircle className="w-3 h-3 mr-1" />Non configuré</Badge>;
      default:
        return null;
    }
  };

  if (csrfLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Chargement du jeton de sécurité...</p>
        </div>
      </div>
    );
  }

  if (csrfError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-destructive">Erreur du jeton de sécurité</p>
          <Button onClick={() => window.location.reload()} className="mt-2">
            Actualiser la page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Google Places API Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">G</span>
              </div>
              <div>
                <CardTitle className="text-lg">Google Places API</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Synchroniser les avis Google Maps
                </p>
              </div>
            </div>
            {getStatusBadge(getGoogleStatus())}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="google-api-key">Clé API Google Places</Label>
              <div className="relative">
                <Input
                  id="google-api-key"
                  type={showGoogleKey ? 'text' : 'password'}
                  placeholder="AIzaSy..."
                  value={settings.googlePlacesApiKey}
                  onChange={(e) => setSettings(prev => ({ ...prev, googlePlacesApiKey: e.target.value }))}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowGoogleKey(!showGoogleKey)}
                >
                  {showGoogleKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="google-place-id">ID du lieu Google</Label>
              <Input
                id="google-place-id"
                placeholder="ChIJ..."
                value={settings.googlePlaceId}
                onChange={(e) => setSettings(prev => ({ ...prev, googlePlaceId: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="enable-google-sync"
                checked={settings.enableGoogleSync}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableGoogleSync: checked }))}
              />
              <Label htmlFor="enable-google-sync">Activer la synchronisation Google</Label>
            </div>
            
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleTestGoogle}
              disabled={isTestingGoogle || !settings.googlePlacesApiKey || !settings.googlePlaceId}
              className="flex items-center gap-2"
            >
              {isTestingGoogle ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <TestTube className="h-4 w-4" />
              )}
              {isTestingGoogle ? 'Test en cours...' : 'Tester l\'API'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Facebook Graph API Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">f</span>
              </div>
              <div>
                <CardTitle className="text-lg">Facebook Graph API</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Synchroniser les avis Facebook
                </p>
              </div>
            </div>
            {getStatusBadge(getFacebookStatus())}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook-access-token">Token d'accès Facebook</Label>
              <div className="relative">
                <Input
                  id="facebook-access-token"
                  type={showFacebookToken ? 'text' : 'password'}
                  placeholder="EAAG..."
                  value={settings.facebookAccessToken}
                  onChange={(e) => setSettings(prev => ({ ...prev, facebookAccessToken: e.target.value }))}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowFacebookToken(!showFacebookToken)}
                >
                  {showFacebookToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="facebook-page-id">ID de la page Facebook</Label>
              <Input
                id="facebook-page-id"
                placeholder="123456789"
                value={settings.facebookPageId}
                onChange={(e) => setSettings(prev => ({ ...prev, facebookPageId: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="enable-facebook-sync"
                checked={settings.enableFacebookSync}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableFacebookSync: checked }))}
              />
              <Label htmlFor="enable-facebook-sync">Activer la synchronisation Facebook</Label>
            </div>
            
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleTestFacebook}
              disabled={isTestingFacebook || !settings.facebookAccessToken || !settings.facebookPageId}
              className="flex items-center gap-2"
            >
              {isTestingFacebook ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <TestTube className="h-4 w-4" />
              )}
              {isTestingFacebook ? 'Test en cours...' : 'Tester l\'API'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">📚 Comment configurer les API externes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div>
            <strong>Google Places API:</strong>
            <ol className="list-decimal list-inside ml-4 mt-1 space-y-1">
              <li>Créez un projet sur <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Cloud Console</a></li>
              <li>Activez l'API Places</li>
              <li>Créez une clé API</li>
              <li>Trouvez l'ID de votre lieu sur <a href="https://developers.google.com/maps/documentation/places/web-service/place-id" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Place ID Finder</a></li>
            </ol>
          </div>
          
          <div>
            <strong>Facebook Graph API:</strong>
            <ol className="list-decimal list-inside ml-4 mt-1 space-y-1">
              <li>Créez une application sur <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Facebook Developers</a></li>
              <li>Générez un token d'accès avec les permissions nécessaires</li>
              <li>Récupérez l'ID de votre page Facebook</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isPending || csrfLoading}
          className="flex items-center gap-2"
        >
          {isPending && <RefreshCw className="h-4 w-4 animate-spin" />}
          <Save className="h-4 w-4" />
          {isPending ? 'Sauvegarde...' : 'Sauvegarder la configuration'}
        </Button>
      </div>
    </div>
  );
}
