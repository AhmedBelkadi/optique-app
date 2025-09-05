import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Lazy import Prisma / services
    const { getSyncStatus } = await import('@/features/testimonials/services/autoSyncReviews');

    const status = await getSyncStatus();
    
    return NextResponse.json(status);
  } catch (error) {
    console.error('Error fetching sync status:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch sync status',
        hasGoogleConfig: false,
        hasFacebookConfig: false,
        total: 0,
        synced: 0,
        lastSynced: null
      },
      { status: 500 }
    );
  }
}
