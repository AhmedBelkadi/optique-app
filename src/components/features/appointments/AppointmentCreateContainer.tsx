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
     
      {/* Create Form */}
      <AppointmentCreateForm 
        onCreate={handleCreate}
        isCreating={isCreating}
        setIsCreating={setIsCreating}
      />
    </div>
  );
}
