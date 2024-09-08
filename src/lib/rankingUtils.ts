import { Team, PowerRanking } from './types';

export function calculateRankings(teams: Team[], previousRankings: PowerRanking[]): PowerRanking[] {
  const rankingScores = teams.map(team => {
    const winLossScore = (team.wins / (team.wins + team.losses)) * 100;
    const pointsScoredScore = (team.pointsScored / teams.reduce((max, t) => Math.max(max, t.pointsScored), 0)) * 100;
    const pointsProjectedScore = (team.pointsProjected / teams.reduce((max, t) => Math.max(max, t.pointsProjected), 0)) * 100;
    return {
      team,
      score: (winLossScore + pointsScoredScore + pointsProjectedScore) / 3,
    };
  });

  rankingScores.sort((a, b) => b.score - a.score);

  return rankingScores.map((ranking, index) => {
    const previousRanking = previousRankings.find(r => r.team.id === ranking.team.id);
    return {
      rank: index + 1,
      previousRank: previousRanking ? previousRanking.rank : index + 1,
      team: ranking.team,
    };
  });
}

// Add new function to calculate power rankings using real data
export function calculatePowerRankings(data: any): PowerRanking[] {
  const rankings = data.rankings.map((team: any) => ({
    rank: 0, // Will be set later
    userId: team.userId,
    username: team.username,
    avatar: team.avatar,
    wins: team.wins,
    losses: team.losses,
    ties: team.ties,
    points: team.points,
    powerScore: 0, // Will be calculated
  }));

  // Calculate power score (you can adjust this formula as needed)
  rankings.forEach((team: any) => { // Explicitly type 'team' as 'any'
    const winPercentage = (team.wins + 0.5 * team.ties) / (team.wins + team.losses + team.ties);
    team.powerScore = winPercentage * 0.7 + (team.points / 100) * 0.3;
  });

  // Sort by power score and assign ranks
  rankings.sort((a: any, b: any) => b.powerScore - a.powerScore);
  rankings.forEach((team: any, index: number) => {
    team.rank = index + 1;
  });

  return rankings;
}