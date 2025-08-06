import { hash, compare } from 'bcryptjs';
import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'crypto';
import { env } from '@/lib/env';

const ALGORITHM = 'aes-256-cbc';

// Ensure we have a 32-byte key for AES-256-CBC
function getSecretKey(): Buffer {
  const envKey = env.ENCRYPTION_KEY;
  if (!envKey || envKey.length < 32) {
    throw new Error('Invalid encryption key configuration');
  }
  // Use SHA-256 to generate a consistent 32-byte key from any input
  return createHash('sha256').update(envKey).digest();
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword);
}

export function generateRandomString(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateSecureToken(): string {
  return generateRandomString(64);
}

// Session encryption/decryption helpers
export function encryptSession(data: string): string {
  const iv = randomBytes(16);
  const secretKey = getSecretKey();
  const cipher = createCipheriv(ALGORITHM, secretKey, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export function decryptSession(encryptedData: string): string {
  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const secretKey = getSecretKey();
    const decipher = createDecipheriv(ALGORITHM, secretKey, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    throw new Error('Failed to decrypt session data');
  }
} 