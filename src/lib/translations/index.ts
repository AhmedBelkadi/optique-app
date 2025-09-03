export { fr } from './fr';
export { en } from './en';

export type Language = 'fr' | 'en';

export const translations = {
  fr: () => import('./fr').then(m => m.fr),
  en: () => import('./en').then(m => m.en),
};

export const defaultLanguage: Language = 'fr';
