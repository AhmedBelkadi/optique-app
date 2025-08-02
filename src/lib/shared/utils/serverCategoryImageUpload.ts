import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export interface CategoryImageUploadResult {
  filename: string;
  path: string;
  size: number;
}

export async function saveCategoryImage(
  file: File,
  categoryId: string
): Promise<CategoryImageUploadResult> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create unique filename
  const timestamp = Date.now();
  const extension = file.name.split('.').pop();
  const filename = `${categoryId}-${timestamp}.${extension}`;

  // Ensure uploads directory exists
  const uploadsDir = join(process.cwd(), 'public', 'uploads', 'categories');
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true });
  }

  // Save file
  const filePath = join(uploadsDir, filename);
  await writeFile(filePath, buffer);

  return {
    filename,
    path: `/uploads/categories/${filename}`,
    size: buffer.length,
  };
} 