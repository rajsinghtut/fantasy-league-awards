import { Team, PowerRanking, FunMetrics, WeeklyRankings } from './types';

export const mockTeams: Team[] = [
  { id: '1', name: 'Team Alpha', avatar: 'avatar1', wins: 5, losses: 2, pointsScored: 780, pointsProjected: 120 },
  { id: '2', name: 'Team Beta', avatar: 'avatar2', wins: 4, losses: 3, pointsScored: 750, pointsProjected: 115 },
  { id: '3', name: 'Team Gamma', avatar: 'avatar3', wins: 6, losses: 1, pointsScored: 820, pointsProjected: 125 },
  { id: '4', name: 'Team Delta', avatar: 'avatar4', wins: 3, losses: 4, pointsScored: 700, pointsProjected: 110 },
  { id: '5', name: 'Team Epsilon', avatar: 'avatar5', wins: 2, losses: 5, pointsScored: 650, pointsProjected: 105 },
];

export const mockCurrentWeekRankings: PowerRanking[] = [
  { rank: 1, previousRank: 2, team: mockTeams[2] },
  { rank: 2, previousRank: 1, team: mockTeams[0] },
  { rank: 3, previousRank: 3, team: mockTeams[1] },
  { rank: 4, previousRank: 5, team: mockTeams[3] },
  { rank: 5, previousRank: 4, team: mockTeams[4] },
];

export const mockFunMetrics: FunMetrics = {
  highestScoreThisWeek: { team: 'Team Gamma', score: 150 },
  lowestScoreThisWeek: { team: 'Team Epsilon', score: 70 },
  biggestRankJump: { team: 'Team Delta', jump: 1 },
  biggestRankDrop: { team: 'Team Epsilon', drop: 1 },
  mostPointsScoredOverall: { team: 'Team Gamma', points: 820 },
  leastPointsScoredOverall: { team: 'Team Epsilon', points: 650 },
  longestWinningStreak: { team: 'Team Gamma', streak: 4 },
  longestLosingStreak: { team: 'Team Epsilon', streak: 3 },
  closestWin: { winner: 'Team Beta', loser: 'Team Delta', margin: 2 },
  biggestBlowout: { winner: 'Team Gamma', loser: 'Team Epsilon', margin: 80 },
  bestComeback: { team: 'Team Alpha', deficit: 30 },
  highestPointsPerPlayer: { team: 'Team Gamma', player: 'Player X', points: 40 },
  mostPointsLeftOnBench: { team: 'Team Beta', points: 50 },
  highestProjectedScoreNextWeek: { team: 'Team Gamma', score: 125 },
  teamToWatch: { team: 'Team Delta', reason: 'Improving performance' },
};

export const mockPastWeeklyRankings: WeeklyRankings[] = [
  {
    week: 6,
    rankings: [
      { rank: 1, previousRank: 1, team: mockTeams[0] },
      { rank: 2, previousRank: 3, team: mockTeams[2] },
      { rank: 3, previousRank: 2, team: mockTeams[1] },
      { rank: 4, previousRank: 4, team: mockTeams[4] },
      { rank: 5, previousRank: 5, team: mockTeams[3] },
    ],
    funMetrics: { ...mockFunMetrics },
  },
  {
    week: 5,
    rankings: [
      { rank: 1, previousRank: 2, team: mockTeams[0] },
      { rank: 2, previousRank: 1, team: mockTeams[1] },
      { rank: 3, previousRank: 4, team: mockTeams[2] },
      { rank: 4, previousRank: 3, team: mockTeams[4] },
      { rank: 5, previousRank: 5, team: mockTeams[3] },
    ],
    funMetrics: { ...mockFunMetrics },
  },
];