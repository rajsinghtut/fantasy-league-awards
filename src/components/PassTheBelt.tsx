'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Belt Holder</CardTitle>
        </CardHeader>
        <CardContent>
          {beltHolder && (
            <div className="space-y-2">
              <p><strong>Team:</strong> {beltHolder.teamName}</p>
              <p><strong>Week Acquired:</strong> {beltHolder.weekAcquired}</p>
              <p><strong>Current Streak:</strong> {beltHolder.currentStreak}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Longest Streak</CardTitle>
        </CardHeader>
        <CardContent>
          {longestStreak && (
            <div className="space-y-2">
              <p><strong>Team:</strong> {longestStreak.teamName}</p>
              <p><strong>Streak:</strong> {longestStreak.streak}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}