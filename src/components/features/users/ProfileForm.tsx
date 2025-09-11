'use client';

import { useEffect, useRef } from 'react';
import { useActionState } from 'react';
import { updateProfileAction } from '@/features/users/actions/updateProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserWithRoles } from '@/features/auth/services/session';
import { User, Phone, Mail, Calendar, Shield, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCSRF } from '@/components/common/CSRFProvider';

interface ProfileFormProps {
  user: UserWithRoles;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const previousIsPending = useRef(false);
  const { csrfToken, isLoading: csrfLoading, error: csrfError } = useCSRF();
  
  const [state, formAction, isPending] = useActionState(updateProfileAction, {
    success: false,
    error: '',
    fieldErrors: {},
    values: {
      name: user.name,
      email: user.email,
      phone: user.phone || '',
    },
  });

  // Handle form success/error
  useEffect(() => {
    if (previousIsPending.current && !isPending && !state.error && state.success) {
      toast.success('Profil mis à jour avec succès!');
    } else if (previousIsPending.current && !isPending && state.error) {
      toast.error(state.error || 'Erreur lors de la mise à jour');
    }
    previousIsPending.current = isPending;
  }, [isPending, state.error, state.success]);

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
      {/* Enhanced Current User Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-xl border border-slate-200/50">
        <div className="flex items-center space-x-4 p-4 bg-white/70 rounded-lg shadow-sm">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Nom</p>
            <p className="text-sm text-slate-600">{user.name}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 p-4 bg-white/70 rounded-lg shadow-sm">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Email</p>
            <p className="text-sm text-slate-600">{user.email}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 p-4 bg-white/70 rounded-lg shadow-sm">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Phone className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Téléphone</p>
            <p className="text-sm text-slate-600">
              {user.phone || 'Non renseigné'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 p-4 bg-white/70 rounded-lg shadow-sm">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <Calendar className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Dernière connexion</p>
            <p className="text-sm text-slate-600">
              {user.lastLoginAt 
                ? new Date(user.lastLoginAt).toLocaleDateString('fr-FR')
                : 'Jamais'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Role Information */}
      <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-slate-50 to-purple-50/30 rounded-xl border border-slate-200/50">
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
          <Shield className="h-6 w-6 text-purple-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-700 mb-2">Rôles et Permissions</p>
          <div className="flex flex-wrap gap-2">
            {user.roles.map((role) => (
              <Badge 
                key={role} 
                variant="secondary"
                className="px-3 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
              >
                {role}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Profile Update Form */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Modifier vos Informations</h3>
            <p className="text-sm text-slate-600">
              Mettez à jour vos informations personnelles ci-dessous
            </p>
          </div>
          
          <form action={formAction} className="space-y-6">
            {/* CSRF Token */}
            <input type="hidden" name="csrf_token" value={csrfToken} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                  Nom complet *
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={state.values?.name || user.name}
                  placeholder="Votre nom complet"
                  required
                  className={`h-11 transition-all duration-200 ${
                    state.fieldErrors?.name 
                      ? 'border-red-500 focus:border-destructive focus:ring-destructive bg-red-50' 
                      : 'border-slate-300 focus:border-primary focus:ring-primary/20 hover:border-slate-400'
                  }`}
                />
                {state.fieldErrors?.name && (
                  <FormMessage className="text-red-600 text-sm">{state.fieldErrors.name[0]}</FormMessage>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Adresse email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={state.values?.email || user.email}
                  placeholder="votre@email.com"
                  required
                  className={`h-11 transition-all duration-200 ${
                    state.fieldErrors?.email 
                      ? 'border-red-500 focus:border-destructive focus:ring-destructive bg-red-50' 
                      : 'border-slate-300 focus:border-primary focus:ring-primary/20 hover:border-slate-400'
                  }`}
                />
                {state.fieldErrors?.email && (
                  <FormMessage className="text-red-600 text-sm">{state.fieldErrors.email[0]}</FormMessage>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                Numéro de téléphone
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={state.values?.phone || user.phone || ''}
                placeholder="+33 6 12 34 56 78"
                className={`h-11 transition-all duration-200 ${
                  state.fieldErrors?.phone 
                    ? 'border-red-500 focus:border-destructive focus:ring-destructive bg-red-50' 
                    : 'border-slate-300 focus:border-primary focus:ring-primary/20 hover:border-slate-400'
                }`}
              />
              {state.fieldErrors?.phone && (
                <FormMessage className="text-red-600 text-sm">{state.fieldErrors.phone[0]}</FormMessage>
              )}
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
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mettre à jour
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
                ✅ Votre profil a été mis à jour avec succès!
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
    </div>
  );
}
