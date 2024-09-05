'use client'

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBeltHolder, getLongestStreak } from '@/lib/pass-the-belt';

interface BeltHolder {
  teamId: string;
  teamName: string;
  weekAcquired: number;
  currentStreak: number;
}

interface LongestStreak {
  teamId: string;
  teamName: string;
  streak: number;
}

export function PassTheBelt() {
  const [beltHolder, setBeltHolder] = useState<BeltHolder | null>(null);
  const [longestStreak, setLongestStreak] = useState<LongestStreak | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const currentBeltHolder = await getBeltHolder();
        const currentLongestStreak = await getLongestStreak();
        setBeltHolder(currentBeltHolder);
        setLongestStreak(currentLongestStreak);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Current Belt Holder</CardTitle>
        </CardHeader>
        <CardContent>
          {beltHolder ? (
            <>
              <p className="text-2xl font-bold">{beltHolder.teamName}</p>
              <p>Acquired in Week {beltHolder.weekAcquired}</p>
              <p>Current Streak: {beltHolder.currentStreak} week(s)</p>
            </>
          ) : (
            <p>No current belt holder</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Longest Streak of the Season</CardTitle>
        </CardHeader>
        <CardContent>
          {longestStreak ? (
            <>
              <p className="text-2xl font-bold">{longestStreak.teamName}</p>
              <p>Streak: {longestStreak.streak} week(s)</p>
            </>
          ) : (
            <p>No longest streak recorded yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}