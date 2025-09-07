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
      // The form component will handle the actual update
      // This function is called by the form after successful update
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
      <div className="flex items-center justify-end">
      
        <div className="flex items-center gap-3">
          <Link href={`/admin/appointments/${appointment.id}`}>
            <Button className="bg-gray-300 text-black font-medium py-2 px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200">
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
