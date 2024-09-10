import { NextResponse } from 'next/server';
import { getBeltHolder, getLongestStreak } from '@/lib/pass-the-belt';

export async function GET() {
  try {
    const beltHolder = await getBeltHolder();
    const longestStreak = await getLongestStreak();
    return NextResponse.json({ beltHolder, longestStreak });
  } catch (error) {
    console.error('Error fetching belt holder data:', error);
    return NextResponse.json({ error: 'Failed to fetch belt holder data' }, { status: 500 });
  }
}