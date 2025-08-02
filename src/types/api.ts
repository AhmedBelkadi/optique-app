// Based on your actual action interfaces
export interface LoginState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  values?: {
    email: string;
  };
  success?: boolean;
}

export interface RegisterState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  values?: {
    name: string;
    email: string;
  };
  success?: boolean;
}

export interface CategoryActionState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  values?: {
    name: string;
    description: string;
  };
  success?: boolean;
}

export interface CreateProductState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  values?: {
    name: string;
    description: string;
    price: string;
    brand: string;
    reference: string;
    categoryIds: string[];
  };
  success?: boolean;
  productId?: string;
}

export interface UpdateProductState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  values?: {
    name: string;
    description: string;
    price: string;
    brand: string;
    reference: string;
    categoryIds: string[];
  };
  success?: boolean;
}

export interface DeleteProductState {
  success?: boolean;
  error?: string;
}

export interface RestoreProductState {
  success?: boolean;
  error?: string;
}

export interface LogoutState {
  success?: boolean;
  error?: string;
} 