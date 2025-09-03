import { fr } from '@/lib/translations/fr';

export const useTranslation = () => {
  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let value: any = fr;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    if (typeof value === 'string') {
      // Replace parameters if provided
      if (params) {
        return Object.entries(params).reduce((str, [key, val]) => {
          return str.replace(new RegExp(`{${key}}`, 'g'), val);
        }, value);
      }
      return value;
    }
    
    return key;
  };
  
  return { t, language: 'fr' as const };
};
