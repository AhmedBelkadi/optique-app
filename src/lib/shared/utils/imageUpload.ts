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
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB - Reduced for better performance
const MAX_IMAGES_PER_PRODUCT = 10;
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export function validateImage(file: File): ImageValidationResult {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.',
    };
  }

  // Check file extension (additional security layer)
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
    return {
      isValid: false,
      error: 'Invalid file extension. Only .jpg, .jpeg, .png, and .webp files are allowed.',
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
    };
  }

  // Check for empty files
  if (file.size === 0) {
    return {
      isValid: false,
      error: 'File is empty. Please select a valid image file.',
    };
  }

  // Check filename for path traversal attempts
  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    return {
      isValid: false,
      error: 'Invalid filename. Filename contains illegal characters.',
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