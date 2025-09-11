'use client';

import { useEffect, useRef, useState } from 'react';
import { useActionState } from 'react';
import { changePasswordAction } from '@/features/users/actions/changePassword';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Eye, EyeOff, AlertTriangle, Loader2, CheckCircle, Shield, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCSRF } from '@/components/common/CSRFProvider';

export function PasswordChangeForm() {
  const previousIsPending = useRef(false);
  const { csrfToken, isLoading: csrfLoading, error: csrfError } = useCSRF();
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [state, formAction, isPending] = useActionState(changePasswordAction, {
    success: false,
    error: '',
    fieldErrors: {},
    values: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Handle form success/error
  useEffect(() => {
    if (previousIsPending.current && !isPending && !state.error && state.success) {
      toast.success('Mot de passe modifié avec succès!');
      // Reset form values
      state.values = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      };
    } else if (previousIsPending.current && !isPending && state.error) {
      toast.error(state.error || 'Erreur lors du changement de mot de passe');
    }
    previousIsPending.current = isPending;
  }, [isPending, state.error, state.success, state.values, state]);

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  if (csrfLoading) {
    return (
      <div className="flex items-center justify-center space-x-3 p-8 bg-slate-50/50 rounded-lg">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="text-slate-600">Chargement du jeton de sécurité...</span>
      </div>
    );
  }

  if (csrfError) {
    return (
      <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-3" />
        <p className="text-red-700 font-medium">Erreur du jeton de sécurité.</p>
        <p className="text-sm text-red-600 mt-1">Veuillez actualiser la page.</p>
      </div>
    );
  }

  if (!csrfToken) {
    return (
      <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-3" />
        <p className="text-red-700 font-medium">Jeton de sécurité non disponible.</p>
        <p className="text-sm text-red-600 mt-1">Veuillez actualiser la page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Security Notice */}
      <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50/30">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <span className="font-medium">Sécurité renforcée :</span> Pour des raisons de sécurité, vous devez saisir votre mot de passe actuel 
          pour confirmer le changement. Votre nouveau mot de passe doit respecter 
          les critères de sécurité de l'application.
        </AlertDescription>
      </Alert>

      {/* Enhanced Password Change Form */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Changer votre Mot de Passe</h3>
            <p className="text-sm text-slate-600">
              Assurez la sécurité de votre compte avec un nouveau mot de passe
            </p>
          </div>
          
          <form action={formAction} className="space-y-6">
            {/* CSRF Token */}
            <input type="hidden" name="csrf_token" value={csrfToken} />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-sm font-medium text-slate-700 flex items-center space-x-2">
                  <Key className="h-4 w-4 text-blue-600" />
                  <span>Mot de passe actuel *</span>
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPasswords.current ? 'text' : 'password'}
                    placeholder="Votre mot de passe actuel"
                    required
                    className={`h-11 pr-12 transition-all duration-200 ${
                      state.fieldErrors?.currentPassword 
                        ? 'border-red-500 focus:border-destructive focus:ring-destructive bg-red-50' 
                        : 'border-slate-300 focus:border-primary focus:ring-primary/20 hover:border-slate-400'
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-500 hover:text-slate-700"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {state.fieldErrors?.currentPassword && (
                  <FormMessage className="text-red-600 text-sm">{state.fieldErrors.currentPassword[0]}</FormMessage>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium text-slate-700 flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-green-600" />
                  <span>Nouveau mot de passe *</span>
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPasswords.new ? 'text' : 'password'}
                    placeholder="Votre nouveau mot de passe"
                    required
                    className={`h-11 pr-12 transition-all duration-200 ${
                      state.fieldErrors?.newPassword 
                        ? 'border-red-500 focus:border-destructive focus:ring-destructive bg-red-50' 
                        : 'border-slate-300 focus:border-primary focus:ring-primary/20 hover:border-slate-400'
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-500 hover:text-slate-700"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {state.fieldErrors?.newPassword && (
                  <FormMessage className="text-red-600 text-sm">{state.fieldErrors.newPassword[0]}</FormMessage>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <span>Confirmer le nouveau mot de passe *</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    placeholder="Confirmez votre nouveau mot de passe"
                    required
                    className={`h-11 pr-12 transition-all duration-200 ${
                      state.fieldErrors?.confirmPassword 
                        ? 'border-red-500 focus:border-destructive focus:ring-destructive bg-red-50' 
                        : 'border-slate-300 focus:border-primary focus:ring-primary/20 hover:border-slate-400'
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-500 hover:text-slate-700"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {state.fieldErrors?.confirmPassword && (
                  <FormMessage className="text-red-600 text-sm">{state.fieldErrors.confirmPassword[0]}</FormMessage>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-200">
              <Button 
                type="submit" 
                disabled={isPending}
                className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Modification...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Modifier
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Enhanced Success/Error Messages */}
      {state.success && (
        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50/30 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-800 font-medium">
                ✅ Votre mot de passe a été modifié avec succès!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {state.error && (
        <Card className="border-red-200 bg-gradient-to-r from-red-50 to-pink-50/30 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-800 font-medium">
                ❌ {state.error}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Password Requirements */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50/30">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center justify-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>Exigences du Mot de Passe</span>
            </h4>
            <p className="text-sm text-blue-700">Assurez-vous que votre nouveau mot de passe respecte ces critères</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg border border-blue-200/50">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold text-sm">8+</span>
              </div>
              <p className="text-xs font-medium text-blue-800">Minimum 8 caractères</p>
            </div>
            
            <div className="text-center p-4 bg-white/50 rounded-lg border border-blue-200/50">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold text-sm">128</span>
              </div>
              <p className="text-xs font-medium text-blue-800">Maximum 128 caractères</p>
            </div>
            
            <div className="text-center p-4 bg-white/50 rounded-lg border border-blue-200/50">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold text-sm">≠</span>
              </div>
              <p className="text-xs font-medium text-blue-800">Différent de l'ancien</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
