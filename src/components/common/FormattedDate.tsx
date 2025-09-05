'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function useHasHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}

export function FormattedTime({ date }: { date: string }) {
  const hydrated = useHasHydrated();

  if (!hydrated) return null;

  try {
    return <>{format(new Date(date), 'HH:mm', { locale: fr })}</>;
  } catch {
    return <>{date}</>;
  }
}

export function FormattedDate({ date }: { date: string }) {
  const hydrated = useHasHydrated();

  if (!hydrated) return null;

  try {
    return <>{format(new Date(date), 'dd MMM yyyy', { locale: fr })}</>;
  } catch {
    return <>{date}</>;
  }
}

export function FormattedDateTime({ date }: { date: string }) {
  const hydrated = useHasHydrated();

  if (!hydrated) return null;

  try {
    return <>{format(new Date(date), 'dd MMM yyyy à HH:mm', { locale: fr })}</>;
  } catch {
    return <>{date}</>;
  }
}
