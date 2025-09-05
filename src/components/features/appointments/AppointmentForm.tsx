'use client';

import { useState } from 'react';
import { Calendar, User, Phone, Mail, Eye, Loader2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { createPublicAppointmentAction } from '@/features/appointments/actions/createPublicAppointment';
import { useCSRF } from '@/components/common/CSRFProvider';
import { ContactSettings } from '@/features/settings/schema/settingsSchema';
import { toast } from 'react-hot-toast';

const appointmentReasons = [
  { value: "eye-test", label: "Examen de la vue" },
  { value: "frame-fitting", label: "Essayage de montures" },
  { value: "contact-lens", label: "Consultation lentilles de contact" },
  { value: "repair", label: "Réparation" },
  { value: "consultation", label: "Consultation générale" },
  { value: "other", label: "Autre" },
];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30"
];

export function AppointmentForm({ contactSettings }: { contactSettings: ContactSettings | null }) {
  const { csrfToken, isLoading: csrfLoading, error: csrfError } = useCSRF();
  const [state, setState] = useState({
    success: false,
    message: '',
    error: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom form submission handler
  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setState({ success: false, message: '', error: '' }); // Clear previous state
    
    try {
      const result = await createPublicAppointmentAction(null, formData);
      
      if (result.success) {
        setState({ success: true, message: result.message || 'Rendez-vous créé avec succès!', error: '' });
        toast.success(result.message || 'Rendez-vous créé avec succès!');
        // Reset form
        const form = document.querySelector('form');
        if (form) {
          form.reset();
        }
      } else {
        setState({ success: false, message: '', error: result.error || 'Une erreur est survenue' });
        toast.error(result.error || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setState({ success: false, message: '', error: 'Une erreur est survenue lors de la soumission' });
      toast.error('Une erreur est survenue lors de la soumission');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];
  
  // Get maximum date (3 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  // Show CSRF loading state
  if (csrfLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Chargement du jeton de sécurité...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show CSRF error state
  if (csrfError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-12 text-center">
            <div className="w-8 h-8 mx-auto mb-4 text-destructive">⚠️</div>
            <p className="text-destructive font-medium">Erreur du jeton de sécurité.</p>
            <p className="text-sm text-muted-foreground mt-2">Veuillez actualiser la page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show CSRF token not available state
  if (!csrfToken) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-12 text-center">
            <div className="w-8 h-8 mx-auto mb-4 text-destructive">⚠️</div>
            <p className="text-destructive font-medium">Jeton de sécurité non disponible.</p>
            <p className="text-sm text-muted-foreground mt-2">Veuillez actualiser la page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="shadow-xl border-0 bg-background/80 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Formulaire de Rendez-vous
          </CardTitle>
        </div>
        <p className="text-muted-foreground text-sm">
          Remplissez le formulaire ci-dessous pour réserver votre consultation
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Success Message */}
        {state.success && (
          <div key="success" className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 text-green-700">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm">✅</span>
              </div>
              <span className="font-medium">{state.message}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {state.error && (
          <div key="error" className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 text-destructive">
              <div className="w-6 h-6 bg-destructive/10 rounded-full flex items-center justify-center">
                <span className="text-sm">❌</span>
              </div>
              <span className="font-medium">{state.error}</span>
            </div>
          </div>
        )}

        <form action={handleSubmit} className="space-y-8">
          {/* CSRF Token */}
          <input type="hidden" name="csrf_token" value={csrfToken} />
          
          {/* Customer Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Vos Informations
              </h3>
            </div>
            
            {/* Name Field */}
            <div className="space-y-3">
              <Label htmlFor="customerName" className="text-sm font-semibold text-foreground">
                Nom complet *
              </Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  id="customerName"
                  name="customerName"
                  placeholder="Votre nom complet"
                  className="pl-12 h-12 border-border focus:border-primary focus:ring-primary text-base rounded-xl"
                  required
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-3">
              <Label htmlFor="customerPhone" className="text-sm font-semibold text-foreground">
                Téléphone *
              </Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  id="customerPhone"
                  name="customerPhone"
                  type="tel"
                  placeholder="+XXX XX XX XX XX"
                  className="pl-12 h-12 border-border focus:border-primary focus:ring-primary text-base rounded-xl"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-3">
              <Label htmlFor="customerEmail" className="text-sm font-semibold text-foreground">
                Email *
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  id="customerEmail"
                  name="customerEmail"
                  type="email"
                  placeholder="votre.email@exemple.com"
                  className="pl-12 h-12 border-border focus:border-primary focus:ring-primary text-base rounded-xl"
                  required
                />
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Détails du Rendez-vous
              </h3>
            </div>

            {/* Date and Time Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Field */}
              <div className="space-y-3">
                <Label htmlFor="appointmentDate" className="text-sm font-semibold text-foreground">
                  Date préférée *
                </Label>
                <Input
                  id="appointmentDate"
                  name="appointmentDate"
                  type="date"
                  min={today}
                  max={maxDateStr}
                  className="h-12 border-border focus:border-primary focus:ring-primary text-base rounded-xl"
                  required
                />
              </div>

              {/* Time Field */}
              <div className="space-y-3">
                <Label htmlFor="appointmentTime" className="text-sm font-semibold text-foreground">
                  Heure préférée *
                </Label>
                <Select name="appointmentTime" required>
                  <SelectTrigger className="h-12 border-border focus:border-primary focus:ring-primary text-base rounded-xl">
                    <SelectValue placeholder="Sélectionner l'heure" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Duration and Reason Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Duration Field */}
              <div className="space-y-3">
                <Label htmlFor="duration" className="text-sm font-semibold text-foreground">
                  Durée estimée *
                </Label>
                <Select name="duration" defaultValue="60" required>
                  <SelectTrigger className="h-12 border-border focus:border-primary focus:ring-primary text-base rounded-xl">
                    <SelectValue placeholder="Sélectionner la durée" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 heure</SelectItem>
                    <SelectItem value="90">1 heure 30</SelectItem>
                    <SelectItem value="120">2 heures</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reason Field */}
              <div className="space-y-3">
                <Label htmlFor="reason" className="text-sm font-semibold text-foreground">
                  Motif de la visite *
                </Label>
                <div className="relative">
                  <Eye className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 z-10" />
                  <Select name="reason" required>
                    <SelectTrigger className="pl-12 h-12 border-border focus:border-primary focus:ring-primary text-base rounded-xl">
                      <SelectValue placeholder="Sélectionner le motif" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentReasons.map((reason) => (
                        <SelectItem key={reason.value} value={reason.value}>
                          {reason.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Notes Field */}
            <div className="space-y-3">
              <Label htmlFor="notes" className="text-sm font-semibold text-foreground">
                Notes supplémentaires
              </Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Informations supplémentaires, préférences, etc."
                className="min-h-[100px] border-border focus:border-primary focus:ring-primary text-base rounded-xl resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              ) : (
                <Calendar className="mr-3 h-5 w-5" />
              )}
              {isSubmitting ? 'Enregistrement...' : 'Confirmer le Rendez-vous'}
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 space-y-4">
            <div className="p-4 bg-muted/30 rounded-xl border border-muted/50">
              <p className="text-sm text-muted-foreground text-center">
                <strong className="text-foreground">Note:</strong> Nous vous confirmerons votre rendez-vous par WhatsApp dans les 24h.
              </p>
            </div>
            
            {/* WhatsApp Contact Button */}
            <Button 
              type="button"
              variant="default"
              className="w-full bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700 shadow-lg hover:shadow-xl transition-all duration-300 "
              asChild
            >
              <a 
                href={`${contactSettings?.whatsappChatLink || ''}?text=Bonjour! J'ai une question concernant les rendez-vous. Pouvez-vous m'aider?`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Contacter sur WhatsApp
              </a>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 