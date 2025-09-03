import { Clock, CheckCircle, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AppointmentInfoCardsProps {
  contactSettings?: {
    phone?: string | null;
    contactEmail?: string | null;
    openingHours?: string | null;
    address?: string | null;
  } | null;
}

export function AppointmentInfoCards({ contactSettings }: AppointmentInfoCardsProps) {
  return (
    <div className="space-y-6">
      {/* Business Hours Card */}
      <Card className="shadow-xl border-0 bg-background/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            Horaires d'Ouverture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 bg-muted/30 rounded-lg">
              <span className="font-semibold text-foreground text-sm">Horaires:</span>
              <p className="text-muted-foreground text-sm mt-1">
                {contactSettings?.openingHours || 'Lundi - Samedi: 9h00 - 19h00, Dimanche: Fermé'}
              </p>
            </div>
            <div className="pt-3 border-t border-muted/50">
              <p className="text-sm text-muted-foreground text-center">
                Les rendez-vous sont disponibles par créneaux de 30 minutes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Info */}
      <Card className="shadow-xl border-0 bg-background/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            Nos Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center p-2 hover:bg-muted/30 rounded-lg transition-colors">
              <CheckCircle className="w-5 h-5 text-success mr-3 flex-shrink-0" />
              <span className="text-sm font-medium">Examens Complets de la Vue</span>
            </div>
            <div className="flex items-center p-2 hover:bg-muted/30 rounded-lg transition-colors">
              <CheckCircle className="w-5 h-5 text-success mr-3 flex-shrink-0" />
              <span className="text-sm font-medium">Adaptation de Lentilles de Contact</span>
            </div>
            <div className="flex items-center p-2 hover:bg-muted/30 rounded-lg transition-colors">
              <CheckCircle className="w-5 h-5 text-success mr-3 flex-shrink-0" />
              <span className="text-sm font-medium">Sélection de Montures</span>
            </div>
            <div className="flex items-center p-2 hover:bg-muted/30 rounded-lg transition-colors">
              <CheckCircle className="w-5 h-5 text-success mr-3 flex-shrink-0" />
              <span className="text-sm font-medium">Soins d'Urgence</span>
            </div>
            <div className="flex items-center p-2 hover:bg-muted/30 rounded-lg transition-colors">
              <CheckCircle className="w-5 h-5 text-success mr-3 flex-shrink-0" />
              <span className="text-sm font-medium">Soins de Suivi</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="shadow-xl border-0 bg-background/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            Nos Coordonnées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 bg-muted/30 rounded-lg">
              <span className="font-semibold text-foreground text-sm">Adresse:</span>
              <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                {contactSettings?.address || 'Adresse non disponible'}
              </p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <span className="font-semibold text-foreground text-sm">Téléphone:</span>
              <p className="text-muted-foreground text-sm mt-1">{contactSettings?.phone || 'Non disponible'}</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <span className="font-semibold text-foreground text-sm">Email:</span>
              <p className="text-muted-foreground text-sm mt-1">{contactSettings?.contactEmail || 'Non disponible'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
