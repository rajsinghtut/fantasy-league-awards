export interface Team {
  id: string;
  name: string;
  avatar: string;
  wins: number;
  losses: number;
  pointsScored: number;
  pointsProjected: number;
}

export interface PowerRanking {
  rank: number; // Add this line
  previousRank: number;
  team: Team;
}

export interface FunMetrics {
  highestScoreThisWeek: { team: string; score: number };
  lowestScoreThisWeek: { team: string; score: number };
  biggestRankJump: { team: string; jump: number };
  biggestRankDrop: { team: string; drop: number };
  mostPointsScoredOverall: { team: string; points: number };
  leastPointsScoredOverall: { team: string; points: number };
  longestWinningStreak: { team: string; streak: number };
  longestLosingStreak: { team: string; streak: number };
  closestWin: { winner: string; loser: string; margin: number };
  biggestBlowout: { winner: string; loser: string; margin: number };
  bestComeback: { team: string; deficit: number };
  highestPointsPerPlayer: { team: string; player: string; points: number };
  mostPointsLeftOnBench: { team: string; points: number };
  highestProjectedScoreNextWeek: { team: string; score: number };
  teamToWatch: { team: string; reason: string };
}

export interface WeeklyRankings {
  week: number;
  rankings: PowerRanking[];
  funMetrics: FunMetrics;
}