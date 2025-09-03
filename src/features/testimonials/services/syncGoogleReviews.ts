import { prisma } from '@/lib/prisma';
import { env } from '@/lib/env';

export interface GoogleReview {
  id: string;
  author_name: string;
  rating: number;
  text: string;
  time: number;
  profile_photo_url?: string;
}

export interface SyncGoogleReviewsResult {
  success: boolean;
  synced: number;
  errors: string[];
  message: string;
}

export async function syncGoogleReviews(): Promise<SyncGoogleReviewsResult> {
  try {
    // Get API settings from database
    const settings = await prisma.externalAPISettings.findFirst();
    
    if (!settings || !settings.googlePlacesApiKey || !settings.googlePlaceId || !settings.enableGoogleSync) {
      return {
        success: false,
        synced: 0,
        errors: ['Google Places API not configured or disabled'],
        message: 'Google Places API not configured. Please configure the API key and place ID in the admin panel.',
      };
    }

    const apiKey = settings.googlePlacesApiKey;
    const placeId = settings.googlePlaceId;

    // Fetch reviews from Google Places API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`
    );

    if (!response.ok) {
      return {
        success: false,
        synced: 0,
        errors: [`HTTP Error: ${response.status} ${response.statusText}`],
        message: `Failed to fetch reviews from Google Places API: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      return {
        success: false,
        synced: 0,
        errors: [`Google API Error: ${data.status} - ${data.error_message || 'Unknown error'}`],
        message: `Google Places API error: ${data.status}`,
      };
    }

    if (!data.result.reviews || !Array.isArray(data.result.reviews)) {
      return {
        success: false,
        synced: 0,
        errors: ['No reviews found or invalid response format'],
        message: 'No reviews found for this location.',
      };
    }

    const reviews: GoogleReview[] = data.result.reviews;
    let syncedCount = 0;
    const errors: string[] = [];

    for (const review of reviews) {
      try {
        // Check if review already exists
        const existingReview = await prisma.testimonial.findFirst({
          where: {
            externalId: review.id,
            source: 'google',
          },
        });

        if (existingReview) {
          // Update existing review
          await prisma.testimonial.update({
            where: { id: existingReview.id },
            data: {
              name: review.author_name,
              message: review.text,
              rating: review.rating,
              image: review.profile_photo_url || null,
              isVerified: true,
              isSynced: true,
              syncStatus: 'synced',
              lastSynced: new Date(),
              updatedAt: new Date(),
            },
          });
        } else {
          // Create new review
          await prisma.testimonial.create({
            data: {
              name: review.author_name,
              message: review.text,
              rating: review.rating,
              source: 'google',
              externalId: review.id,
              externalUrl: `https://maps.google.com/?cid=${placeId}`,
              image: review.profile_photo_url || null,
              isActive: true,
              isVerified: true,
              isSynced: true,
              syncStatus: 'synced',
              lastSynced: new Date(),
            },
          });
        }

        syncedCount++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Failed to sync review ${review.id}: ${errorMessage}`);
      }
    }

    return {
      success: true,
      synced: syncedCount,
      errors,
      message: `Successfully synced ${syncedCount} Google reviews.${errors.length > 0 ? ` ${errors.length} errors occurred.` : ''}`,
    };

  } catch (error) {
    console.error('Error syncing Google reviews:', error);
    return {
      success: false,
      synced: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
      message: 'Failed to sync Google reviews due to an unexpected error.',
    };
  }
}
