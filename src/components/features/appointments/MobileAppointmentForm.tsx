'use client';

import { useState } from 'react';
import { Calendar, User, Phone, Mail, Eye, Loader2, MessageCircle, ChevronLeft, ChevronRight, Check } from 'lucide-react';
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

interface FormData {
  name: string;
  email: string;
  phone: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  duration: string;
  message: string;
}

export function MobileAppointmentForm({ contactSettings }: { contactSettings: ContactSettings | null }) {
  const { csrfToken, isLoading: csrfLoading, error: csrfError } = useCSRF();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    duration: '60',
    message: ''
  });
  const [state, setState] = useState({
    success: false,
    message: '',
    error: ''
  });

  const totalSteps = 4;

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Final validation before submission
    if (!isStepValid(1) || !isStepValid(2) || !isStepValid(3)) {
      setState({ 
        success: false, 
        message: '', 
        error: 'Veuillez remplir tous les champs obligatoires avant de soumettre.' 
      });
      toast.error('Veuillez remplir tous les champs obligatoires avant de soumettre.');
      return;
    }

    setIsSubmitting(true);
    setState({ success: false, message: '', error: '' });
    
    try {
      const formDataObj = new FormData();
      formDataObj.append('customerName', formData.name.trim());
      formDataObj.append('customerEmail', formData.email.trim());
      formDataObj.append('customerPhone', formData.phone.trim());
      formDataObj.append('appointmentDate', formData.appointmentDate);
      formDataObj.append('appointmentTime', formData.appointmentTime);
      formDataObj.append('reason', formData.reason);
      formDataObj.append('duration', formData.duration);
      formDataObj.append('notes', formData.message.trim());
      
      if (csrfToken) {
        formDataObj.append('csrf_token', csrfToken);
      }
      
      const result = await createPublicAppointmentAction(null, formDataObj);
      
      if (result.success) {
        setState({ success: true, message: result.message || 'Rendez-vous créé avec succès!', error: '' });
        toast.success(result.message || 'Rendez-vous créé avec succès!');
        setCurrentStep(5); // Success step
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

  const isStepValid = (step: number): boolean => {
    let isValid = false;
    
    switch (step) {
      case 1:
        isValid = formData.name.trim() !== '' && 
                 formData.email.trim() !== '' && 
                 formData.phone.trim() !== '' &&
                 formData.email.includes('@') && 
                 formData.phone.length >= 8;
        break;
      case 2:
        isValid = formData.appointmentDate !== '' && formData.appointmentTime !== '';
        break;
      case 3:
        isValid = formData.reason !== '' && formData.duration !== '';
        break;
      case 4:
        isValid = true; // Message is optional
        break;
      default:
        isValid = false;
    }
    
    return isValid;
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
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
  if (csrfError || !csrfToken) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
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

  // Success step
  if (currentStep === 5) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Rendez-vous confirmé!</h2>
            <p className="text-muted-foreground mb-6">{state.message}</p>
            <Button 
              onClick={() => {
                setCurrentStep(1);
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  appointmentDate: '',
                  appointmentTime: '',
                  reason: '',
                  duration: '60',
                  message: ''
                });
                setState({ success: false, message: '', error: '' });
              }}
              className="w-full"
            >
              Prendre un autre rendez-vous
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-background/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl font-bold text-foreground">
              Rendez-vous
            </CardTitle>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 mb-4">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          
          <p className="text-muted-foreground text-sm">
            Étape {currentStep} sur {totalSteps}
          </p>
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* Error Message */}
          {state.error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl shadow-sm">
              <div className="flex items-center gap-3 text-destructive">
                <div className="w-6 h-6 bg-destructive/20 rounded-full flex items-center justify-center">
                  <span className="text-sm">⚠️</span>
                </div>
                <span className="font-medium">{state.error}</span>
              </div>
            </div>
          )}

          {/* Step Validation Messages */}
          {currentStep === 1 && !isStepValid(1) && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-700 text-sm">
                Veuillez remplir tous les champs obligatoires avec des informations valides.
              </p>
            </div>
          )}
          
          {currentStep === 2 && !isStepValid(2) && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-700 text-sm">
                Veuillez sélectionner une date et une heure pour votre rendez-vous.
              </p>
            </div>
          )}
          
          {currentStep === 3 && !isStepValid(3) && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-700 text-sm">
                Veuillez sélectionner le motif et la durée de votre consultation.
              </p>
            </div>
          )}

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <User className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Vos informations</h3>
                <p className="text-sm text-muted-foreground">Nous avons besoin de vos coordonnées pour vous contacter</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">Nom complet *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="Votre nom complet"
                    className={`h-12 text-base ${formData.name.trim() === '' ? 'border-amber-300' : 'border-green-300'}`}
                    autoComplete="name"
                  />
                  {formData.name.trim() === '' && (
                    <p className="text-amber-600 text-xs mt-1">Ce champ est obligatoire</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="votre@email.com"
                    className={`h-12 text-base ${formData.email.trim() === '' || !formData.email.includes('@') ? 'border-amber-300' : 'border-green-300'}`}
                    autoComplete="email"
                  />
                  {formData.email.trim() === '' && (
                    <p className="text-amber-600 text-xs mt-1">Ce champ est obligatoire</p>
                  )}
                  {formData.email.trim() !== '' && !formData.email.includes('@') && (
                    <p className="text-amber-600 text-xs mt-1">Veuillez entrer un email valide</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">Téléphone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="+33 1 23 45 67 89"
                    className={`h-12 text-base ${formData.phone.trim() === '' || formData.phone.length < 8 ? 'border-amber-300' : 'border-green-300'}`}
                    autoComplete="tel"
                  />
                  {formData.phone.trim() === '' && (
                    <p className="text-amber-600 text-xs mt-1">Ce champ est obligatoire</p>
                  )}
                  {formData.phone.trim() !== '' && formData.phone.length < 8 && (
                    <p className="text-amber-600 text-xs mt-1">Le numéro doit contenir au moins 8 caractères</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Date and Time */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Calendar className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Date et heure</h3>
                <p className="text-sm text-muted-foreground">Choisissez votre créneau préféré</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="appointmentDate" className="text-sm font-medium">Date *</Label>
                  <Input
                    id="appointmentDate"
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) => updateFormData('appointmentDate', e.target.value)}
                    min={today}
                    max={maxDateStr}
                    className={`h-12 text-base ${formData.appointmentDate === '' ? 'border-amber-300' : 'border-green-300'}`}
                  />
                  {formData.appointmentDate === '' && (
                    <p className="text-amber-600 text-xs mt-1">Veuillez sélectionner une date</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="appointmentTime" className="text-sm font-medium">Heure *</Label>
                  <Select value={formData.appointmentTime} onValueChange={(value) => updateFormData('appointmentTime', value)}>
                    <SelectTrigger className={`h-12 text-base ${formData.appointmentTime === '' ? 'border-amber-300' : 'border-green-300'}`}>
                      <SelectValue placeholder="Sélectionnez une heure" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time} className="h-12 text-base">
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.appointmentTime === '' && (
                    <p className="text-amber-600 text-xs mt-1">Veuillez sélectionner une heure</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Reason */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Eye className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Motif de consultation</h3>
                <p className="text-sm text-muted-foreground">Dites-nous pourquoi vous souhaitez prendre rendez-vous</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reason" className="text-sm font-medium">Type de consultation *</Label>
                  <Select value={formData.reason} onValueChange={(value) => updateFormData('reason', value)}>
                    <SelectTrigger className={`h-12 text-base ${formData.reason === '' ? 'border-amber-300' : 'border-green-300'}`}>
                      <SelectValue placeholder="Sélectionnez un motif" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentReasons.map((reason) => (
                        <SelectItem key={reason.value} value={reason.value} className="h-12 text-base">
                          {reason.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.reason === '' && (
                    <p className="text-amber-600 text-xs mt-1">Veuillez sélectionner un motif de consultation</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="duration" className="text-sm font-medium">Durée estimée *</Label>
                  <Select value={formData.duration} onValueChange={(value) => updateFormData('duration', value)}>
                    <SelectTrigger className={`h-12 text-base ${formData.duration === '' ? 'border-amber-300' : 'border-green-300'}`}>
                      <SelectValue placeholder="Sélectionnez la durée" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30" className="h-12 text-base">30 minutes</SelectItem>
                      <SelectItem value="45" className="h-12 text-base">45 minutes</SelectItem>
                      <SelectItem value="60" className="h-12 text-base">1 heure</SelectItem>
                      <SelectItem value="90" className="h-12 text-base">1 heure 30</SelectItem>
                      <SelectItem value="120" className="h-12 text-base">2 heures</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.duration === '' && (
                    <p className="text-amber-600 text-xs mt-1">Veuillez sélectionner la durée estimée</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Additional Information */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <MessageCircle className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Informations supplémentaires</h3>
                <p className="text-sm text-muted-foreground">Ajoutez des détails si nécessaire (optionnel)</p>
              </div>
              
              <div>
                <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => updateFormData('message', e.target.value)}
                  placeholder="Décrivez vos besoins spécifiques, symptômes, ou toute information utile..."
                  className="min-h-[120px] text-base resize-none"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="flex-1 h-12"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Précédent
              </Button>
            )}
            
            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className="flex-1 h-12"
              >
                Suivant
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !isStepValid(currentStep)}
                className="flex-1 h-12"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    Confirmer
                    <Check className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
