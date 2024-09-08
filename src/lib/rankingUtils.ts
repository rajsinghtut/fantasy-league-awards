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