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
      </div>

      {/* Create Form */}
      <AppointmentCreateForm 
        onCreate={handleCreate}
        isCreating={isCreating}
        setIsCreating={setIsCreating}
      />
    </div>
  );
}
