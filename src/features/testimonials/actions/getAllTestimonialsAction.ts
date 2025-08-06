'use server';

import { getAllTestimonials } from '../queries/getAllTestimonials';

export async function getAllTestimonialsAction(params: {
  search?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}) {
  return getAllTestimonials(params);
} 