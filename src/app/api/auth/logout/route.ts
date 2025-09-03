import { NextRequest, NextResponse } from 'next/server';
import { destroySession } from '@/features/auth/services/session';

export async function POST(request: NextRequest) {
  try {
    await destroySession();
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
