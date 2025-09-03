import { prisma } from '@/lib/prisma';
import { syncGoogleReviews } from './syncGoogleReviews';
import { syncFacebookReviews } from './syncFacebookReviews';

export interface AutoSyncResult {
  success: boolean;
  totalSynced: number;
  google: { success: boolean; synced: number; message: string; };
  facebook: { success: boolean; synced: number; message: string; };
  message: string;
  errors: string[];
}

export async function autoSyncReviews(): Promise<AutoSyncResult> {
  try {
    // Get API settings from database
    const settings = await prisma.externalAPISettings.findFirst();
    
    if (!settings) {
      return {
        success: false,
        totalSynced: 0,
        google: { success: false, synced: 0, message: 'No API settings found' },
        facebook: { success: false, synced: 0, message: 'No API settings found' },
        message: 'No external API settings configured. Please configure API keys in the admin panel.',
        errors: ['No API settings found'],
      };
    }

    const results = {
      google: { success: false, synced: 0, message: '' },
      facebook: { success: false, synced: 0, message: '' },
    };

    let totalSynced = 0;
    const allErrors: string[] = [];

    // Sync Google reviews if enabled
    if (settings.enableGoogleSync && settings.googlePlacesApiKey && settings.googlePlaceId) {
      try {
        const googleResult = await syncGoogleReviews();
        results.google = {
          success: googleResult.success,
          synced: googleResult.synced,
          message: googleResult.message,
        };
        totalSynced += googleResult.synced;
        allErrors.push(...googleResult.errors);
      } catch (error) {
        results.google = {
          success: false,
          synced: 0,
          message: 'Failed to sync Google reviews due to an error',
        };
        allErrors.push(`Google sync error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      results.google = {
        success: false,
        synced: 0,
        message: 'Google sync is disabled or not configured',
      };
    }

    // Sync Facebook reviews if enabled
    if (settings.enableFacebookSync && settings.facebookAccessToken && settings.facebookPageId) {
      try {
        const facebookResult = await syncFacebookReviews();
        results.facebook = {
          success: facebookResult.success,
          synced: facebookResult.synced,
          message: facebookResult.message,
        };
        totalSynced += facebookResult.synced;
        allErrors.push(...facebookResult.errors);
      } catch (error) {
        results.facebook = {
          success: false,
          synced: 0,
          message: 'Failed to sync Facebook reviews due to an error',
        };
        allErrors.push(`Facebook sync error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      results.facebook = {
        success: false,
        synced: 0,
        message: 'Facebook sync is disabled or not configured',
      };
    }

    // Determine overall success
    const hasSuccessfulSync = results.google.success || results.facebook.success;
    const overallSuccess = hasSuccessfulSync && totalSynced > 0;

    // Create overall message
    let message = '';
    if (overallSuccess) {
      message = `Successfully synced ${totalSynced} reviews total.`;
      if (results.google.success) message += ` Google: ${results.google.synced} reviews.`;
      if (results.facebook.success) message += ` Facebook: ${results.facebook.synced} reviews.`;
    } else if (hasSuccessfulSync) {
      message = 'Sync completed but no new reviews were found.';
    } else {
      message = 'No reviews were synced. Check your API configuration.';
    }

    if (allErrors.length > 0) {
      message += ` ${allErrors.length} errors occurred during sync.`;
    }

    return {
      success: overallSuccess,
      totalSynced,
      google: results.google,
      facebook: results.facebook,
      message,
      errors: allErrors,
    };

  } catch (error) {
    console.error('Error in auto sync reviews:', error);
    return {
      success: false,
      totalSynced: 0,
      google: { success: false, synced: 0, message: 'Auto sync failed' },
      facebook: { success: false, synced: 0, message: 'Auto sync failed' },
      message: 'Failed to perform auto sync due to an unexpected error.',
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}

export async function manualSyncReviews(): Promise<AutoSyncResult> {
  return autoSyncReviews();
}

export async function getSyncStatus() {
  try {
    // Get API settings from database
    const settings = await prisma.externalAPISettings.findFirst();
    
    // Get testimonial counts
    const [totalTestimonials, syncedTestimonials, pendingTestimonials, failedTestimonials] = await Promise.all([
      prisma.testimonial.count({ where: { isDeleted: false } }),
      prisma.testimonial.count({ where: { isDeleted: false, syncStatus: 'synced' } }),
      prisma.testimonial.count({ where: { isDeleted: false, syncStatus: 'pending' } }),
      prisma.testimonial.count({ where: { isDeleted: false, syncStatus: 'failed' } }),
    ]);

    // Get last sync timestamp
    const lastSynced = await prisma.testimonial.findFirst({
      where: { isDeleted: false, lastSynced: { not: null } },
      orderBy: { lastSynced: 'desc' },
      select: { lastSynced: true },
    });

    return {
      total: totalTestimonials,
      synced: syncedTestimonials,
      pending: pendingTestimonials,
      failed: failedTestimonials,
      lastSynced: lastSynced?.lastSynced || null,
      hasGoogleConfig: !!(settings?.googlePlacesApiKey && settings?.googlePlaceId && settings?.enableGoogleSync),
      hasFacebookConfig: !!(settings?.facebookAccessToken && settings?.facebookPageId && settings?.enableFacebookSync),
    };
  } catch (error) {
    console.error('Error getting sync status:', error);
    return {
      total: 0,
      synced: 0,
      pending: 0,
      failed: 0,
      lastSynced: null,
      hasGoogleConfig: false,
      hasFacebookConfig: false,
    };
  }
}
