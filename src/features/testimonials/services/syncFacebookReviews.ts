import { prisma } from '@/lib/prisma';

export interface FacebookReview {
  id: string;
  reviewer_name: string;
  rating: number;
  recommendation_type: string;
  review_text?: string;
  created_time: string;
}

export interface SyncFacebookReviewsResult {
  success: boolean;
  synced: number;
  errors: string[];
  message: string;
}

export async function syncFacebookReviews(): Promise<SyncFacebookReviewsResult> {
  try {
    // Get API settings from database
    const settings = await prisma.externalAPISettings.findFirst();
    
    if (!settings || !settings.facebookAccessToken || !settings.facebookPageId || !settings.enableFacebookSync) {
      return {
        success: false,
        synced: 0,
        errors: ['Facebook API not configured or disabled'],
        message: 'Facebook API not configured. Please configure the access token and page ID in the admin panel.',
      };
    }

    const accessToken = settings.facebookAccessToken;
    const pageId = settings.facebookPageId;

    // Fetch reviews from Facebook Graph API
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}/ratings?access_token=${accessToken}&fields=reviewer,rating,recommendation_type,review_text,created_time`
    );

    if (!response.ok) {
      return {
        success: false,
        synced: 0,
        errors: [`HTTP Error: ${response.status} ${response.statusText}`],
        message: `Failed to fetch reviews from Facebook API: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();

    if (data.error) {
      return {
        success: false,
        synced: 0,
        errors: [`Facebook API Error: ${data.error.code} - ${data.error.message}`],
        message: `Facebook API error: ${data.error.code}`,
      };
    }

    if (!data.data || !Array.isArray(data.data)) {
      return {
        success: false,
        synced: 0,
        errors: ['No reviews found or invalid response format'],
        message: 'No reviews found for this Facebook page.',
      };
    }

    const reviews: FacebookReview[] = data.data;
    let syncedCount = 0;
    const errors: string[] = [];

    for (const review of reviews) {
      try {
        // Convert Facebook rating to 1-5 scale
        const rating = review.recommendation_type === 'positive' ? 5 : 1;
        
        // Create default message if no review text
        const message = review.review_text || `Avis ${review.recommendation_type === 'positive' ? 'positif' : 'négatif'} sur Facebook`;

        // Check if review already exists
        const existingReview = await prisma.testimonial.findFirst({
          where: {
            externalId: review.id,
            source: 'facebook',
          },
        });

        if (existingReview) {
          // Update existing review
          await prisma.testimonial.update({
            where: { id: existingReview.id },
            data: {
              name: review.reviewer_name,
              message: message,
              rating: rating,
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
              name: review.reviewer_name,
              message: message,
              rating: rating,
              source: 'facebook',
              externalId: review.id,
              externalUrl: `https://facebook.com/${pageId}`,
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
      message: `Successfully synced ${syncedCount} Facebook reviews.${errors.length > 0 ? ` ${errors.length} errors occurred.` : ''}`,
    };

  } catch (error) {
    console.error('Error syncing Facebook reviews:', error);
    return {
      success: false,
      synced: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
      message: 'Failed to sync Facebook reviews due to an unexpected error.',
    };
  }
}
