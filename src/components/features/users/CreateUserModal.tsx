'use client';

import { useEffect, useRef, useState } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Loader2, X } from 'lucide-react';
import { createUserAction } from '@/features/users/actions/createUser';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useCSRF } from '@/components/common/CSRFProvider';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newUser: any) => void;
}

export default function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
  const previousIsPending = useRef(false);
  const { csrfToken } = useCSRF();
  const [selectedRole, setSelectedRole] = useState('staff');

  const [state, formAction, isPending] = useActionState(createUserAction, {
    success: false,
    error: '',
    warning: '',
    fieldErrors: {},
    values: {
      name: '',
      email: '',
      role: 'staff',
      notes: '',
    },
  });

  useEffect(() => {

    
    if (previousIsPending.current && !isPending) {
      if (state.success) {
        toast.success('Utilisateur créé avec succès !', {
          icon: '✅',
          style: {
            background: '#10b981',
            color: '#ffffff',
          },
        });
        
        // Create a temporary user object for UI update
        if (state.userId) {
          const newUser: any = {
            id: state.userId,
            name: state.values.name,
            email: state.values.email,
            isActive: true,
            createdAt: new Date(),
            userRoles: [{
              id: `temp-${Date.now()}`,
              roleId: `temp-role-${Date.now()}`,
              role: {
                id: `temp-role-${Date.now()}`,
                name: state.values.role,
                description: null
              }
            }]
          };
          onSuccess(newUser);
        }
        
        onClose();
        // Reset form
        setSelectedRole('staff');
      } else if (state.error) {
        toast.error(state.error || 'Échec de la création de l\'utilisateur', {
          icon: '❌',
          style: {
            background: '#ef4444',
            color: '#ffffff',
          },
        });
      }
      
      if (state.warning) {
        toast(state.warning, { 
          icon: '⚠️',
          style: {
            background: '#f59e0b',
            color: '#ffffff',
          },
        });
      }
    }
    previousIsPending.current = isPending;
  }, [isPending, state.success, state.error, state.warning, state.userId, state.values, onSuccess, onClose]);

  const handleClose = () => {
    if (!isPending) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-foreground">
                Créer un Nouveau Membre du Staff
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Ajouter un nouveau membre du staff à votre équipe
              </p>
            </div>
          </div>
        </DialogHeader>

        <form action={formAction} className="space-y-6">
          {/* Hidden CSRF token */}
          <input type="hidden" name="csrf_token" value={csrfToken || ''} />
          
          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Nom Complet *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                className={`transition-all duration-200 ${
                  state.fieldErrors?.name 
                    ? 'border-red-500 focus:border-destructive focus:ring-destructive' 
                    : 'border-border focus:border-primary focus:ring-primary'
                }`}
                placeholder="Entrez le nom complet *"
                disabled={isPending}
              />
              {state.fieldErrors?.name && (
                <p className="text-sm text-destructive flex items-center">
                  <X className="w-4 h-4 mr-2" />
                  {state.fieldErrors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Adresse Email *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className={`transition-all duration-200 ${
                  state.fieldErrors?.email 
                    ? 'border-red-500 focus:border-destructive focus:ring-destructive' 
                    : 'border-border focus:border-primary focus:ring-primary'
                }`}
                placeholder="Entrez l'adresse email *"
                disabled={isPending}
              />
              {state.fieldErrors?.email && (
                <p className="text-sm text-destructive flex items-center">
                  <X className="w-4 h-4 mr-2" />
                  {state.fieldErrors.email}
                </p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium text-foreground">
                Rôle *
              </Label>
              <Select
                value={selectedRole}
                onValueChange={setSelectedRole}
                disabled={isPending}
              >
                <SelectTrigger className={`transition-all duration-200 ${
                  state.fieldErrors?.role 
                    ? 'border-red-500 focus:border-destructive focus:ring-destructive' 
                    : 'border-border focus:border-primary focus:ring-primary'
                }`}>
                  <SelectValue placeholder="Sélectionner un rôle *" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              {/* Hidden input for form submission */}
              <input type="hidden" name="role" value={selectedRole} />
              {state.fieldErrors?.role && (
                <p className="text-sm text-destructive flex items-center">
                  <X className="w-4 h-4 mr-2" />
                  {state.fieldErrors.role}
                </p>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium text-foreground">
                Notes (Optionnel)
              </Label>
              <Textarea
                id="notes"
                name="notes"
                rows={3}
                className={`transition-all duration-200 ${
                  state.fieldErrors?.notes 
                    ? 'border-red-500 focus:border-destructive focus:ring-destructive' 
                    : 'border-border focus:border-primary focus:ring-primary'
                }`}
                placeholder="Toute note supplémentaire sur cet utilisateur (optionnel)"
                disabled={isPending}
              />
              {state.fieldErrors?.notes && (
                <p className="text-sm text-destructive flex items-center">
                  <X className="w-4 h-4 mr-2" />
                  {state.fieldErrors.notes}
                </p>
              )}
            </div>
          </div>

          {state.error && (
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-4">
                <div className="flex items-center text-destructive">
                  <X className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{state.error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <DialogFooter className="pt-4">
            <div className="flex space-x-3 w-full">
              <Button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="bg-gray-300 text-black font-medium py-2 px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-[linear-gradient(to_right,hsl(var(--primary)),hsl(var(--primary)/0.8))] hover:bg-[linear-gradient(to_right,hsl(var(--primary)/0.9),hsl(var(--primary)/0.7))] text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                      Créer un Utilisateur
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
