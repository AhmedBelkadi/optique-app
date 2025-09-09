import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { randomBytes } from 'crypto';

export interface SiteSettingsImageUploadResult {
  filename: string;
  path: string;
  size: number;
}

export async function saveSiteSettingsImage(
  file: File,
  imageType: 'logo' | 'hero-background' | 'about-section'
): Promise<SiteSettingsImageUploadResult> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create unique filename with better collision avoidance
  const timestamp = Date.now();
  const randomSuffix = randomBytes(4).toString('hex');
  const extension = file.name.split('.').pop();
  const filename = `${imageType}-${timestamp}-${randomSuffix}.${extension}`;

  // Ensure uploads directory exists
  const uploadsDir = join(process.cwd(), 'uploads', 'site-settings');
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true });
  }

  // Save file with retry logic for VPS file system issues
  const filePath = join(uploadsDir, filename);
  let retries = 3;
  let lastError: Error | null = null;
  
  while (retries > 0) {
    try {
      await writeFile(filePath, buffer);
      break; // Success, exit retry loop
    } catch (error) {
      lastError = error as Error;
      retries--;
      
      if (retries > 0) {
        // Wait a bit before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 100 * (4 - retries)));
      }
    }
  }
  
  if (retries === 0 && lastError) {
    throw new Error(`Failed to save file after 3 attempts: ${lastError.message}`);
  }

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
