// Based on your actual schemas
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  isDeleted: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: string | null;
  reference: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  isDeleted: boolean;
  categories: Array<{
    id: string;
    name: string;
    description: string | null;
  }>;
  images: Array<{
    id: string;
    filename: string;
    path: string;
    alt: string | null;
    order: number;
  }>;
}

export interface ProductImage {
  id: string;
  filename: string;
  path: string;
  alt: string | null;
  order: number;
} 