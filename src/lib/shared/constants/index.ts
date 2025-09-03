// Based on your actual validation rules
export const VALIDATION_CONSTANTS = {
  auth: {
    name: {
      minLength: 2,
      maxLength: 50,
    },
    email: {
      maxLength: 255,
    },
    password: {
      minLength: 6,
      maxLength: 100,
    },
  },
  categories: {
    name: {
      minLength: 1,
      maxLength: 100,
    },
    description: {
      maxLength: 500,
    },
  },
  products: {
    name: {
      minLength: 1,
      maxLength: 100,
    },
    description: {
      minLength: 1,
      maxLength: 1000,
    },
    price: {
      max: 999999,
    },
    brand: {
      maxLength: 50,
    },
    reference: {
      maxLength: 50,
    },
  },
  testimonials: {
    name: {
      minLength: 2,
      maxLength: 100,
    },
    message: {
      minLength: 10,
      maxLength: 500,
    },
    title: {
      maxLength: 100,
    },
  },
} as const;

export const ERROR_MESSAGES = {
  validation: {
    required: 'Ce champ est requis',
    email: 'Adresse email invalide',
    minLength: (min: number) => `Doit contenir au moins ${min} caractères`,
    maxLength: (max: number) => `Doit contenir moins de ${max} caractères`,
    positive: 'Doit être positif',
    maxValue: (max: number) => `Doit être inférieur à ${max}`,
  },
  auth: {
    passwordsDontMatch: "Les mots de passe ne correspondent pas",
    loginFailed: 'Échec de la connexion',
    registrationFailed: 'Échec de l\'inscription',
  },
  products: {
    atLeastOneCategory: 'Au moins une catégorie est requise',
    createFailed: 'Échec de la création du produit',
    updateFailed: 'Échec de la mise à jour du produit',
    deleteFailed: 'Échec de la suppression du produit',
    restoreFailed: 'Échec de la restauration du produit',
  },
  categories: {
    createFailed: 'Échec de la création de la catégorie',
    updateFailed: 'Échec de la mise à jour de la catégorie',
    deleteFailed: 'Échec de la suppression de la catégorie',
  },
  testimonials: {
    createFailed: 'Échec de la création du témoignage',
    updateFailed: 'Échec de la mise à jour du témoignage',
    deleteFailed: 'Échec de la suppression du témoignage',
    restoreFailed: 'Échec de la restauration du témoignage',
    toggleFailed: 'Échec du changement de statut du témoignage',
  },
} as const; 