import { prisma } from '@/lib/prisma';

export interface ExternalAPISettings {
  id: string;
  googlePlacesApiKey: string | null;
  googlePlaceId: string | null;
  facebookAccessToken: string | null;
  facebookPageId: string | null;
  enableGoogleSync: boolean;
  enableFacebookSync: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateExternalAPISettingsInput {
  googlePlacesApiKey?: string;
  googlePlaceId?: string;
  facebookAccessToken?: string;
  facebookPageId?: string;
  enableGoogleSync?: boolean;
  enableFacebookSync?: boolean;
}

export async function getExternalAPISettings(): Promise<{
  success: boolean;
  data?: ExternalAPISettings;
  error?: string;
}> {
  try {
    // Get or create settings (singleton pattern)
    let settings = await prisma.externalAPISettings.findFirst();
    
    if (!settings) {
      // Create default settings
      settings = await prisma.externalAPISettings.create({
        data: {
          enableGoogleSync: false,
          enableFacebookSync: false,
        },
      });
    }

    return {
      success: true,
      data: settings,
    };
  } catch (error) {
    console.error('Error getting external API settings:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get external API settings',
    };
  }
}

export async function updateExternalAPISettings(data: UpdateExternalAPISettingsInput): Promise<{
  success: boolean;
  data?: ExternalAPISettings;
  error?: string;
}> {
  try {
    // Get existing settings or create new ones
    let settings = await prisma.externalAPISettings.findFirst();
    
    if (settings) {
      // Update existing settings
      settings = await prisma.externalAPISettings.update({
        where: { id: settings.id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new settings
      settings = await prisma.externalAPISettings.create({
        data: {
          ...data,
          enableGoogleSync: data.enableGoogleSync ?? false,
          enableFacebookSync: data.enableFacebookSync ?? false,
        },
      });
    }

    return {
      success: true,
      data: settings,
    };
  } catch (error) {
    console.error('Error updating external API settings:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update external API settings',
    };
  }
}

export async function testGoogleAPIConnection(apiKey: string, placeId: string): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address&key=${apiKey}`
    );

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP Error: ${response.status} ${response.statusText}`,
      };
    }

    const result = await response.json();

    if (result.status === 'OK') {
      return {
        success: true,
        data: {
          placeName: result.result.name,
          address: result.result.formatted_address,
        },
      };
    } else {
      return {
        success: false,
        error: `Google API Error: ${result.status} - ${result.error_message || 'Unknown error'}`,
      };
    }
  } catch (error) {
    console.error('Error testing Google API connection:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to test Google API connection',
    };
  }
}

export async function testFacebookAPIConnection(accessToken: string, pageId: string): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}?access_token=${accessToken}&fields=name,id,verification_status`
    );

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP Error: ${response.status} ${response.statusText}`,
      };
    }

    const result = await response.json();

    if (result.error) {
      return {
        success: false,
        error: `Facebook API Error: ${result.error.code} - ${result.error.message}`,
      };
    }

    if (result.id && result.name) {
      return {
        success: true,
        data: {
          pageName: result.name,
          pageId: result.id,
          verificationStatus: result.verification_status || 'Non vérifié',
        },
      };
    } else {
      return {
        success: false,
        error: 'Invalid Facebook API response',
      };
    }
  } catch (error) {
    console.error('Error testing Facebook API connection:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to test Facebook API connection',
    };
  }
}
