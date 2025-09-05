'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Send, 
  User, 
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useActionState } from 'react';
import { submitContactFormAction } from '@/features/contact/actions/submitContactForm';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useCSRF } from '@/components/common/CSRFProvider';

export default function ContactForm() {
  const { csrfToken, isLoading: csrfLoading, error: csrfError } = useCSRF();
  const [state, formAction, isPending] = useActionState(submitContactFormAction, {
    success: false,
    error: '',
    fieldErrors: {},
    values: {
      name: '',
      phone: '',
      email: '',
      message: '',
    },
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  // Handle state changes and show toast notifications
  useEffect(() => {
    if (state.success) {
      toast.success('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
      setFormData({ name: '', phone: '', email: '', message: '' });
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state.success, state.error]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Show CSRF loading state
  if (csrfLoading) {
    return (
      <Card className="p-8 md:p-12 text-center">
        <CardContent className="p-0">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Chargement du jeton de sécurité...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show CSRF error state
  if (csrfError) {
    return (
      <Card className="p-8 md:p-12 text-center">
        <CardContent className="p-0">
          <div className="flex flex-col items-center space-y-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <p className="text-destructive">Erreur du jeton de sécurité.</p>
            <p className="text-sm text-muted-foreground">Veuillez actualiser la page.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show CSRF token not available state
  if (!csrfToken) {
    return (
      <Card className="p-8 md:p-12 text-center">
        <CardContent className="p-0">
          <div className="flex flex-col items-center space-y-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <p className="text-destructive">Jeton de sécurité non disponible.</p>
            <p className="text-sm text-muted-foreground">Veuillez actualiser la page.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show success message
  if (state.success) {
    return (
      <Card className="p-8 md:p-12 text-center">
        <CardContent className="p-0">
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="w-16 h-16 text-success" />
            <h2 className="text-2xl font-bold text-foreground">Message Envoyé !</h2>
            <p className="text-muted-foreground max-w-md">
              Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="default"
              className="mt-4"
            >
              Envoyer un autre message
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-8 md:p-12 relative overflow-hidden border-border hover:border-primary/30 transition-all duration-300">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-transparent to-secondary/2 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      <CardContent className="p-0 relative">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center mr-3">
              <MessageSquare className="w-4 h-4 text-secondary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Envoyez-nous un message</h2>
          </div>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mb-4"></div>
          <p className="text-muted-foreground">
            Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
          </p>
        </div>

        {/* Error Message */}
        {state.error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-destructive text-sm">{state.error}</p>
          </div>
        )}

        <form action={formAction} className="space-y-8">
          {/* CSRF Token */}
          <input type="hidden" name="csrf_token" value={csrfToken} />
          
          {/* Name Field */}
          <div className="space-y-3">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Nom complet *
            </Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Votre nom complet"
                value={formData.name}
                onChange={handleInputChange}
                className={`pl-12 h-14 border-border focus:border-primary focus:ring-primary text-base ${
                  state.fieldErrors.name ? 'border-destructive' : ''
                }`}
                required
              />
            </div>
            {state.fieldErrors.name && (
              <p className="text-destructive text-sm">{state.fieldErrors.name}</p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-3">
            <Label htmlFor="phone" className="text-sm font-medium text-foreground">
              Téléphone *
            </Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Votre numéro de téléphone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`pl-12 h-14 border-border focus:border-primary focus:ring-primary text-base ${
                  state.fieldErrors.phone ? 'border-destructive' : ''
                }`}
                required
              />
            </div>
            {state.fieldErrors.phone && (
              <p className="text-destructive text-sm">{state.fieldErrors.phone}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email (optionnel)
            </Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Votre adresse email"
                value={formData.email}
                onChange={handleInputChange}
                className={`pl-12 h-14 border-border focus:border-primary focus:ring-primary text-base ${
                  state.fieldErrors.email ? 'border-destructive' : ''
                }`}
              />
            </div>
            {state.fieldErrors.email && (
              <p className="text-destructive text-sm">{state.fieldErrors.email}</p>
            )}
          </div>

          {/* Message Field */}
          <div className="space-y-3">
            <Label htmlFor="message" className="text-sm font-medium text-foreground">
              Message *
            </Label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 text-muted-foreground h-5 w-5" />
              <Textarea
                id="message"
                name="message"
                placeholder="Comment pouvons-nous vous aider ?"
                value={formData.message}
                onChange={handleInputChange}
                className={`pl-12 min-h-[120px] border-border focus:border-primary focus:ring-primary text-base resize-none ${
                  state.fieldErrors.message ? 'border-destructive' : ''
                }`}
                required
              />
            </div>
            {state.fieldErrors.message && (
              <p className="text-destructive text-sm">{state.fieldErrors.message}</p>
            )}
            <div className="text-right">
              <span className={`text-xs ${
                formData.message.length > 800 ? 'text-warning' : 'text-muted-foreground'
              }`}>
                {formData.message.length}/1000
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            disabled={isPending}
          >
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary/20 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Envoyer le Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
