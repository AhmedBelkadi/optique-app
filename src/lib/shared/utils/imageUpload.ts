export interface ImageUploadResult {
  filename: string;
  path: string;
  size: number;
}

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES_PER_PRODUCT = 10;

export function validateImage(file: File): ImageValidationResult {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.',
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'File size too large. Maximum size is 5MB.',
    };
  }

  return { isValid: true };
}

export function validateImageCount(currentCount: number): ImageValidationResult {
  if (currentCount >= MAX_IMAGES_PER_PRODUCT) {
    return {
      isValid: false,
      error: `Maximum ${MAX_IMAGES_PER_PRODUCT} images allowed per product.`,
    };
  }

  return { isValid: true };
}

export function generateImageAlt(productName: string, order: number): string {
  return `${productName} - Image ${order + 1}`;
} 