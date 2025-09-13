import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { randomBytes } from 'crypto';
import { validateImage } from './imageUploadUtils';

export interface SiteSettingsImageUploadResult {
  filename: string;
  path: string;
  size: number;
}

export async function saveSiteSettingsImage(
  file: File,
  imageType: 'logo' | 'hero-background' | 'about-section'
): Promise<SiteSettingsImageUploadResult> {
  console.log(`[Site Settings Upload] Starting upload for ${imageType}`);
  
  // Validate image first
  const validation = validateImage(file);
  if (!validation.isValid) {
    console.error(`[Site Settings Upload] Validation failed: ${validation.error}`);
    throw new Error(validation.error);
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  console.log(`[Site Settings Upload] File size: ${buffer.length} bytes`);

  // Create unique filename with better collision avoidance
  const timestamp = Date.now();
  const randomSuffix = randomBytes(4).toString('hex');
  const extension = file.name.split('.').pop();
  const filename = `${imageType}-${timestamp}-${randomSuffix}.${extension}`;
  console.log(`[Site Settings Upload] Generated filename: ${filename}`);

  // Ensure uploads directory exists
  const uploadsDir = join(process.cwd(), 'uploads', 'site-settings');
  console.log(`[Site Settings Upload] Creating directory: ${uploadsDir}`);
  
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true });
    console.log(`[Site Settings Upload] Directory created: ${uploadsDir}`);
  }

  // Save file with retry logic for VPS file system issues
  const filePath = join(uploadsDir, filename);
  console.log(`[Site Settings Upload] Saving file: ${filePath}`);
  
  let retries = 3;
  let lastError: Error | null = null;
  
  while (retries > 0) {
    try {
      await writeFile(filePath, buffer);
      console.log(`[Site Settings Upload] File saved successfully: ${filePath}`);
      break; // Success, exit retry loop
    } catch (error) {
      lastError = error as Error;
      console.error(`[Site Settings Upload] Attempt ${4 - retries} failed:`, error);
      retries--;
      
      if (retries > 0) {
        // Wait a bit before retrying (exponential backoff)
        const delay = 100 * (4 - retries);
        console.log(`[Site Settings Upload] Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  if (retries === 0 && lastError) {
    console.error(`[Site Settings Upload] Failed after 3 attempts:`, lastError);
    throw new Error(`Failed to save file after 3 attempts: ${lastError.message}`);
  }

  const result = {
    filename,
    path: `/uploads/site-settings/${filename}`,
    size: buffer.length,
  };
  
  console.log(`[Site Settings Upload] Upload completed successfully:`, result);
  return result;
}

export async function deleteSiteSettingsImage(imagePath: string): Promise<void> {
  try {
    const filePath = join(process.cwd(), imagePath);
    await unlink(filePath);
  } catch (error) {
    console.error(`Failed to delete site settings image: ${imagePath}`, error);
  }
}
