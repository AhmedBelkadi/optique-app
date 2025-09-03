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

// Consistent action result types for all operations
export type ActionResult<T> = 
  | { success: true; data: T } 
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

// Category-specific types
export interface CategoryActionState {
  success: boolean;
  error: string;
  fieldErrors: Record<string, string[]>;
  data?: any;
}

export interface CreateCategoryState {
  success: boolean;
  error: string;
  fieldErrors: Record<string, string[]>;
  values: {
    name: string;
    description: string;
  };
  data?: any;
}

export interface UpdateCategoryState {
  success: boolean;
  error: string;
  fieldErrors: Record<string, string[]>;
  values: {
    name: string;
    description: string;
  };
  data?: any;
}

export interface DeleteCategoryState {
  success: boolean;
  error: string;
  data?: any;
}

export interface CreateProductState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  values: {
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
  values: {
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

export interface CreateUserState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  values: {
    name: string;
    email: string;
    role: string;
    notes: string;
  };
  success?: boolean;
  userId?: string;
  warning?: string;
}

export interface DeleteUserState {
  success?: boolean;
  error?: string;
} 