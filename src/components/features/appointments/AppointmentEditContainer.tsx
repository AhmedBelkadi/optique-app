'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import AppointmentEditForm from './AppointmentEditForm';

interface AppointmentStatus {
  id: string;
  name: string;
  displayName: string;
  color: string;
  description?: string | null;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

interface Appointment {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  customer: Customer;
  status: AppointmentStatus;
}

interface AppointmentEditContainerProps {
  appointment: Appointment;
}

export default function AppointmentEditContainer({ appointment }: AppointmentEditContainerProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (formData: any) => {
    setIsSaving(true);
    try {
      // This will be handled by the form component
      toast.success('Rendez-vous mis à jour avec succès');
      router.push(`/admin/appointments/${appointment.id}`);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/admin/appointments/${appointment.id}`}>
            <Button variant="default" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux détails
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Modifier le rendez-vous</h1>
            <p className="text-muted-foreground mt-1">
              Modifier les détails et la planification du rendez-vous
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/admin/appointments/${appointment.id}`}>
            <Button variant="default">
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
          </Link>
          <Button 
            type="submit" 
            form="appointment-edit-form"
            disabled={isSaving}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informations du rendez-vous</CardTitle>
          <CardDescription>
            Modifiez les détails du rendez-vous et les informations du client
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AppointmentEditForm 
            appointment={appointment} 
            onSave={handleSave}
            isSaving={isSaving}
          />
        </CardContent>
      </Card>
    </div>
  );
}
