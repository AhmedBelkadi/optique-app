import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export interface ImageUploadResult {
  filename: string;
  path: string;
  size: number;
}

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

// Configuration
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES_PER_ENTITY = 10;

export function validateImage(file: File): ImageValidationResult {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Type de fichier invalide. Seuls les formats JPEG, PNG et WebP sont autorisés.',
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'Fichier trop volumineux. La taille maximale est de 5MB.',
    };
  }

  return { isValid: true };
}

export function validateImageCount(currentCount: number): ImageValidationResult {
  if (currentCount >= MAX_IMAGES_PER_ENTITY) {
    return {
      isValid: false,
      error: `Nombre maximum d'images atteint (${MAX_IMAGES_PER_ENTITY}).`,
    };
  }

  return { isValid: true };
}

export async function saveImage(
  file: File,
  entityType: 'products' | 'categories' | 'testimonials' | 'site-settings',
  entityId: string,
  order?: number
): Promise<ImageUploadResult> {
  // Validate image
  const validation = validateImage(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create unique filename
  const timestamp = Date.now();
  const extension = file.name.split('.').pop();
  const orderSuffix = order !== undefined ? `-${order}` : '';
  const filename = `${entityId}${orderSuffix}-${timestamp}.${extension}`;

  // Ensure uploads directory exists
  const uploadsDir = join(process.cwd(), 'uploads', entityType);
  console.log(`[Image Upload] Creating directory: ${uploadsDir}`);
  
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true });
    console.log(`[Image Upload] Directory created: ${uploadsDir}`);
  }

  // Save file
  const filePath = join(uploadsDir, filename);
  console.log(`[Image Upload] Saving file: ${filePath}`);
  
  await writeFile(filePath, buffer);
  console.log(`[Image Upload] File saved successfully: ${filePath}`);

  return {
    filename,
    path: `/uploads/${entityType}/${filename}`,
    size: buffer.length,
  };
}

export async function deleteImage(imagePath: string): Promise<void> {
  if (!imagePath || imagePath.startsWith('http')) {
    console.log(`[Image Delete] Skipping external URL: ${imagePath}`);
    return;
  }
  
  try {
    const filePath = join(process.cwd(), imagePath);
    console.log(`[Image Delete] Attempting to delete: ${filePath}`);
    
    if (existsSync(filePath)) {
      await unlink(filePath);
      console.log(`[Image Delete] Successfully deleted: ${filePath}`);
    } else {
      console.log(`[Image Delete] File not found: ${filePath}`);
    }
  } catch (error) {
    console.error(`[Image Delete] Failed to delete image file: ${imagePath}`, error);
    // Don't throw error to avoid breaking the main operation
  }
}

export function generateImageAlt(entityName: string, order?: number): string {
  const suffix = order !== undefined ? ` - Image ${order + 1}` : '';
  return `${entityName}${suffix}`;
}

// Utility for cleaning up orphaned images
export async function cleanupOrphanedImages(
  entityType: 'products' | 'categories' | 'testimonials' | 'site-settings',
  validImagePaths: string[]
): Promise<void> {
  try {
    const uploadsDir = join(process.cwd(), 'uploads', entityType);
    if (!existsSync(uploadsDir)) {
      return;
    }

    // This would require additional file system operations
    // Implementation depends on your specific needs
    console.log(`Cleanup for ${entityType} - keeping ${validImagePaths.length} images`);
  } catch (error) {
    console.error(`Failed to cleanup orphaned images for ${entityType}:`, error);
  }
}
