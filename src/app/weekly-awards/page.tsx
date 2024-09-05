import React from 'react';
import { getWeeklyAwards } from '@/lib/sleeper-api';

export default async function WeeklyAwardsPage() {
  const awards = await getWeeklyAwards();

  return (
    <div>
      <h1>Weekly Awards</h1>
      {/* Render your weekly awards here */}
    </div>
  );
}
