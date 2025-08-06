import { prisma } from './prisma';

export interface ThemeSettings {
  primaryColor?: string | null;
  secondaryColor?: string | null;
}

export async function getThemeSettings(): Promise<ThemeSettings> {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: 'singleton' },
      select: {
        primaryColor: true,
        secondaryColor: true,
      },
    });

    return {
      primaryColor: settings?.primaryColor || null,
      secondaryColor: settings?.secondaryColor || null,
    };
  } catch (error) {
    console.error('Error fetching theme settings:', error);
    return {
      primaryColor: null,
      secondaryColor: null,
    };
  }
}

// Default fallback values for CSS variables
export const DEFAULT_PRIMARY_COLOR = '222.2 47.4% 11.2%';
export const DEFAULT_SECONDARY_COLOR = '210 40% 96%'; 