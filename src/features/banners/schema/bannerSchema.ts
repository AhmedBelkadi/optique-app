import { z } from 'zod';

export const bannerSchema = z.object({
  text: z.string().min(1, 'Banner message is required').max(500, 'Banner message must be less than 500 characters'),
  startDate: z.date({
    required_error: 'Start date is required',
    invalid_type_error: 'Start date must be a valid date',
  }),
  endDate: z.date({
    required_error: 'End date is required',
    invalid_type_error: 'End date must be a valid date',
  }),
  isActive: z.boolean().default(true),
});

export const createBannerSchema = bannerSchema;

export const updateBannerSchema = bannerSchema.partial().extend({
  id: z.string().min(1, 'Banner ID is required'),
});

export type Banner = z.infer<typeof bannerSchema>;
export type CreateBanner = z.infer<typeof createBannerSchema>;
export type UpdateBanner = z.infer<typeof updateBannerSchema>;

export interface BannerWithTimestamps extends Banner {
  id: string;
  createdAt: Date;
  updatedAt: Date;
} 