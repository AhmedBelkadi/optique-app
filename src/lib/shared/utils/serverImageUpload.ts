import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export interface ImageUploadResult {
  filename: string;
  path: string;
  size: number;
}

export async function saveImage(
  file: File,
  productId: string,
  order: number
): Promise<ImageUploadResult> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create unique filename
  const timestamp = Date.now();
  const extension = file.name.split('.').pop();
  const filename = `${productId}-${order}-${timestamp}.${extension}`;

  // Ensure uploads directory exists
  const uploadsDir = join(process.cwd(), 'public', 'uploads', 'products');
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true });
  }

  // Save file
  const filePath = join(uploadsDir, filename);
  await writeFile(filePath, buffer);

  return {
    filename,
    path: `/uploads/products/${filename}`,
    size: buffer.length,
  };
}

export function generateImageAlt(productName: string, order: number): string {
  return `${productName} - Image ${order + 1}`;
} 