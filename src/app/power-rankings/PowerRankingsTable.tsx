import React from 'react';
import { PowerRanking } from '@/lib/types';

interface PowerRankingsTableProps {
  rankings: PowerRanking[];
}

export default function PowerRankingsTable({ rankings }: PowerRankingsTableProps) {
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="px-4 py-2">Rank</th>
          <th className="px-4 py-2">Team</th>
          <th className="px-4 py-2">Previous Rank</th>
          <th className="px-4 py-2">Wins</th>
          <th className="px-4 py-2">Losses</th>
          <th className="px-4 py-2">Points Scored</th>
        </tr>
      </thead>
      <tbody>
        {rankings.map((ranking) => (
          <tr key={ranking.team.id} className={ranking.rank % 2 === 0 ? 'bg-gray-100' : ''}>
            <td className="px-4 py-2">{ranking.rank}</td>
            <td className="px-4 py-2">{ranking.team.name}</td>
            <td className="px-4 py-2">{ranking.previousRank}</td>
            <td className="px-4 py-2">{ranking.team.wins}</td>
            <td className="px-4 py-2">{ranking.team.losses}</td>
            <td className="px-4 py-2">{ranking.team.pointsScored.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}