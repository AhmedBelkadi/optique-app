'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Send, 
  User, 
  Phone,
  Mail,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Loader2,
  MapPin
} from 'lucide-react';
import { useActionState } from 'react';
import { submitContactFormAction } from '@/features/contact/actions/submitContactForm';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useCSRF } from '@/components/common/CSRFProvider';

export default function MobileContactForm() {
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

  const [fieldValidation, setFieldValidation] = useState({
    name: { isValid: false, message: '' },
    phone: { isValid: false, message: '' },
    email: { isValid: false, message: '' },
    message: { isValid: false, message: '' },
  });

  // Real-time validation
  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name':
        if (value.length < 2) {
          return { isValid: false, message: 'Le nom doit contenir au moins 2 caractères' };
        }
        return { isValid: true, message: '' };
      
      case 'phone':
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
        if (!phoneRegex.test(value)) {
          return { isValid: false, message: 'Veuillez entrer un numéro de téléphone valide' };
        }
        return { isValid: true, message: '' };
      
      case 'email':
        if (value && value.length > 0) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            return { isValid: false, message: 'Veuillez entrer une adresse email valide' };
          }
        }
        return { isValid: true, message: '' };
      
      case 'message':
        if (value.length < 10) {
          return { isValid: false, message: 'Le message doit contenir au moins 10 caractères' };
        }
        if (value.length > 1000) {
          return { isValid: false, message: 'Le message ne peut pas dépasser 1000 caractères' };
        }
        return { isValid: true, message: '' };
      
      default:
        return { isValid: true, message: '' };
    }
  };

  // Handle input changes with real-time validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    const validation = validateField(name, value);
    setFieldValidation(prev => ({
      ...prev,
      [name]: validation
    }));
  };

  // Handle state changes and show toast notifications
  useEffect(() => {
    if (state.success) {
      toast.success('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
      setFormData({ name: '', phone: '', email: '', message: '' });
      setFieldValidation({
        name: { isValid: false, message: '' },
        phone: { isValid: false, message: '' },
        email: { isValid: false, message: '' },
        message: { isValid: false, message: '' },
      });
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state.success, state.error]);

  // Check if form is valid
  const isFormValid = fieldValidation.name.isValid && 
                     fieldValidation.phone.isValid && 
                     fieldValidation.email.isValid && 
                     fieldValidation.message.isValid;

  // Show CSRF loading state
  if (csrfLoading) {
    return (
      <Card className="p-6 md:p-8 text-center">
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
      <Card className="p-6 md:p-8 text-center">
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
      <Card className="p-6 md:p-8 text-center">
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
      <Card className="p-6 md:p-8 text-center">
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
              className="mt-4 h-12"
            >
              Envoyer un autre message
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-4 md:p-8">
      <CardContent className="p-0">
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2 md:mb-4">Envoyez-nous un message</h2>
          <p className="text-muted-foreground text-sm md:text-base">
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

        <form action={formAction} className="space-y-6 md:space-y-8">
          {/* CSRF Token */}
          <input type="hidden" name="csrf_token" value={csrfToken} />
          
          {/* Name Field */}
          <div className="space-y-2 md:space-y-3">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Nom complet *
            </Label>
            <div className="relative">
              <User className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 md:h-5 md:w-5" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Votre nom complet"
                value={formData.name}
                onChange={handleInputChange}
                className={`pl-10 md:pl-12 h-12 md:h-14 border-border focus:border-primary focus:ring-primary text-base ${
                  state.fieldErrors.name || !fieldValidation.name.isValid && formData.name.length > 0
                    ? 'border-destructive' 
                    : fieldValidation.name.isValid && formData.name.length > 0
                    ? 'border-green-500'
                    : ''
                }`}
                required
              />
            </div>
            {(state.fieldErrors.name || (!fieldValidation.name.isValid && formData.name.length > 0)) && (
              <p className="text-destructive text-sm">
                {state.fieldErrors.name || fieldValidation.name.message}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-2 md:space-y-3">
            <Label htmlFor="phone" className="text-sm font-medium text-foreground">
              Téléphone *
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 md:h-5 md:w-5" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Votre numéro de téléphone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`pl-10 md:pl-12 h-12 md:h-14 border-border focus:border-primary focus:ring-primary text-base ${
                  state.fieldErrors.phone || !fieldValidation.phone.isValid && formData.phone.length > 0
                    ? 'border-destructive' 
                    : fieldValidation.phone.isValid && formData.phone.length > 0
                    ? 'border-green-500'
                    : ''
                }`}
                required
              />
            </div>
            {(state.fieldErrors.phone || (!fieldValidation.phone.isValid && formData.phone.length > 0)) && (
              <p className="text-destructive text-sm">
                {state.fieldErrors.phone || fieldValidation.phone.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2 md:space-y-3">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email (optionnel)
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 md:h-5 md:w-5" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Votre adresse email"
                value={formData.email}
                onChange={handleInputChange}
                className={`pl-10 md:pl-12 h-12 md:h-14 border-border focus:border-primary focus:ring-primary text-base ${
                  state.fieldErrors.email || !fieldValidation.email.isValid && formData.email.length > 0
                    ? 'border-destructive' 
                    : fieldValidation.email.isValid && formData.email.length > 0
                    ? 'border-green-500'
                    : ''
                }`}
              />
            </div>
            {(state.fieldErrors.email || (!fieldValidation.email.isValid && formData.email.length > 0)) && (
              <p className="text-destructive text-sm">
                {state.fieldErrors.email || fieldValidation.email.message}
              </p>
            )}
          </div>

          {/* Message Field */}
          <div className="space-y-2 md:space-y-3">
            <Label htmlFor="message" className="text-sm font-medium text-foreground">
              Message *
            </Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 md:left-4 top-3 md:top-4 text-muted-foreground h-4 w-4 md:h-5 md:w-5" />
              <Textarea
                id="message"
                name="message"
                placeholder="Comment pouvons-nous vous aider ?"
                value={formData.message}
                onChange={handleInputChange}
                className={`pl-10 md:pl-12 min-h-[100px] md:min-h-[120px] border-border focus:border-primary focus:ring-primary text-base resize-none ${
                  state.fieldErrors.message || !fieldValidation.message.isValid && formData.message.length > 0
                    ? 'border-destructive' 
                    : fieldValidation.message.isValid && formData.message.length > 0
                    ? 'border-green-500'
                    : ''
                }`}
                required
              />
            </div>
            {(state.fieldErrors.message || (!fieldValidation.message.isValid && formData.message.length > 0)) && (
              <p className="text-destructive text-sm">
                {state.fieldErrors.message || fieldValidation.message.message}
              </p>
            )}
            <div className="flex justify-between items-center">
              <span className={`text-xs ${
                formData.message.length > 800 ? 'text-warning' : 'text-muted-foreground'
              }`}>
                {formData.message.length}/1000
              </span>
              {fieldValidation.message.isValid && formData.message.length > 0 && (
                <span className="text-green-600 text-xs flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Valide
                </span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 md:h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isPending || !isFormValid}
          >
            {isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                Envoyer le Message
              </>
            )}
          </Button>

          {/* Form validation summary */}
          {!isFormValid && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Veuillez remplir tous les champs obligatoires correctement
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
