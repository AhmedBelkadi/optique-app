import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export interface SiteSettingsImageUploadResult {
  filename: string;
  path: string;
  size: number;
}

export async function saveSiteSettingsImage(
  file: File,
  imageType: 'logo' | 'hero-background'
): Promise<SiteSettingsImageUploadResult> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create unique filename
  const timestamp = Date.now();
  const extension = file.name.split('.').pop();
  const filename = `${imageType}-${timestamp}.${extension}`;

  // Ensure uploads directory exists
  const uploadsDir = join(process.cwd(), 'uploads', 'site-settings');
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true });
  }

  // Save file
  const filePath = join(uploadsDir, filename);
  await writeFile(filePath, buffer);

  return {
    filename,
    path: `/uploads/site-settings/${filename}`,
    size: buffer.length,
  };
}

export async function deleteSiteSettingsImage(imagePath: string): Promise<void> {
  try {
    const filePath = join(process.cwd(), imagePath);
    await unlink(filePath);
  } catch (error) {
    console.error(`Failed to delete site settings image: ${imagePath}`, error);
  }
}
