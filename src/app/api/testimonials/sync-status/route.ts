import { NextRequest, NextResponse } from 'next/server';
import { getSyncStatus } from '@/features/testimonials/services/autoSyncReviews';

export async function GET(request: NextRequest) {
  try {
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
