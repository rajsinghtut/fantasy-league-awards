'use client';

import React, { useState, useEffect } from 'react';

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

export default function PassTheBelt() {
  const [beltHolder, setBeltHolder] = useState<BeltHolder | null>(null);
  const [longestStreak, setLongestStreak] = useState<LongestStreak | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/belt-holder');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setBeltHolder(data.beltHolder);
        setLongestStreak(data.longestStreak);
      } catch (err) {
        setError('Error fetching data');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Current Belt Holder</h2>
      {beltHolder && (
        <div>
          <p>Team: {beltHolder.teamName}</p>
          <p>Week Acquired: {beltHolder.weekAcquired}</p>
          <p>Current Streak: {beltHolder.currentStreak}</p>
        </div>
      )}
      <h2>Longest Streak</h2>
      {longestStreak && (
        <div>
          <p>Team: {longestStreak.teamName}</p>
          <p>Streak: {longestStreak.streak}</p>
        </div>
      )}
    </div>
  );
}