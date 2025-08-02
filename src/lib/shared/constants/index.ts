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
} as const;

export const ERROR_MESSAGES = {
  validation: {
    required: 'This field is required',
    email: 'Invalid email address',
    minLength: (min: number) => `Must be at least ${min} characters`,
    maxLength: (max: number) => `Must be less than ${max} characters`,
    positive: 'Must be positive',
    maxValue: (max: number) => `Must be less than ${max}`,
  },
  auth: {
    passwordsDontMatch: "Passwords don't match",
    loginFailed: 'Login failed',
    registrationFailed: 'Registration failed',
  },
  products: {
    atLeastOneCategory: 'At least one category is required',
    createFailed: 'Failed to create product',
    updateFailed: 'Failed to update product',
    deleteFailed: 'Failed to delete product',
    restoreFailed: 'Failed to restore product',
  },
  categories: {
    createFailed: 'Failed to create category',
    updateFailed: 'Failed to update category',
    deleteFailed: 'Failed to delete category',
  },
} as const; 