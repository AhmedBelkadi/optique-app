'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import AppointmentCreateForm from './AppointmentCreateForm';

export default function AppointmentCreateContainer() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (formData: any) => {
    setIsCreating(true);
    try {
      // The form component will handle the actual creation
      // We just need to wait for it to complete
    } catch (error) {
      toast.error('Erreur lors de la création');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/appointments">
            <Button variant="default" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux rendez-vous
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Nouveau rendez-vous</h1>
            <p className="text-muted-foreground mt-1">
              Créer un nouveau rendez-vous pour un client
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/appointments">
            <Button variant="default">
              Annuler
            </Button>
          </Link>
          <Button 
            type="submit" 
            form="appointment-create-form"
            disabled={isCreating}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isCreating ? 'Création...' : 'Créer le rendez-vous'}
          </Button>
        </div>
      </div>

      {/* Create Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informations du rendez-vous</CardTitle>
          <CardDescription>
            Remplissez les détails du rendez-vous et les informations du client
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AppointmentCreateForm 
            onCreate={handleCreate}
            isCreating={isCreating}
            setIsCreating={setIsCreating}
          />
        </CardContent>
      </Card>
    </div>
  );
}
