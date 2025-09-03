'use client';

import { useState, useEffect } from 'react';
import { AppointmentForm } from './AppointmentForm';
import { MobileAppointmentForm } from './MobileAppointmentForm';
import { ContactSettings } from '@/features/settings/schema/settingsSchema';

interface ResponsiveAppointmentFormProps {
  contactSettings: ContactSettings | null;
}

export function ResponsiveAppointmentForm({ contactSettings }: ResponsiveAppointmentFormProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    // Check on mount
    checkIsMobile();

    // Add event listener
    window.addEventListener('resize', checkIsMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  if (isMobile) {
    return <MobileAppointmentForm contactSettings={contactSettings} />;
  }

  return <AppointmentForm contactSettings={contactSettings} />;
}
