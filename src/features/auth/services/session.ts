import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { generateSecureToken, encryptSession, decryptSession } from '@/lib/shared/utils/crypto';

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
}

export async function createSession(userId: string): Promise<Session> {
  const token = generateSecureToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Encrypt session data
  const sessionData = JSON.stringify({
    userId,
    token,
    expiresAt: expiresAt.toISOString(),
  });
  const encryptedData = encryptSession(sessionData);

  // Store in database
  const session = await prisma.session.create({
    data: {
      userId,
      token,
      encryptedData,
      expiresAt,
    },
  });

  // Set cookie - await cookies() in Next.js 15
  const cookieStore = await cookies();
  cookieStore.set('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
  });

  return {
    id: session.id,
    userId: session.userId,
    token: session.token,
    expiresAt: session.expiresAt,
  };
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token');

  if (!token) {
    return null;
  }

  try {
    const session = await prisma.session.findUnique({
      where: { token: token.value },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      // Session expired or not found, clean up
      if (session) {
        await prisma.session.delete({ where: { id: session.id } });
      }
      return null;
    }

    // Decrypt session data
    const decryptedData = decryptSession(session.encryptedData);
    const sessionData = JSON.parse(decryptedData);

    return {
      id: session.id,
      userId: session.userId,
      token: session.token,
      expiresAt: session.expiresAt,
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token');

  if (token) {
    // Remove from database
    await prisma.session.deleteMany({
      where: { token: token.value },
    });
  }

  // Remove cookie
  cookieStore.delete('session_token');
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null && session.expiresAt > new Date();
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  return await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
} 