import { fetchPowerRankingsData } from '@/lib/sleeper-api';
import { calculatePowerRankings } from '@/lib/rankingUtils';
import { mockPowerRankings } from '@/lib/mockData';
import PowerRankingsTable from './PowerRankingsTable';

const LEAGUE_ID = '1124820424132165632';

// Add a constant to easily switch between mock and real data
const USE_MOCK_DATA = false;

export default async function PowerRankings() {
  let rankings;
  let leagueInfo;

  if (USE_MOCK_DATA) {
    // Use mock data
    rankings = mockPowerRankings;
    leagueInfo = { name: 'Mock League', season: '2023' };
  } else {
    // Fetch real data from Sleeper
    const leagueId = LEAGUE_ID;
    if (!leagueId) {
      throw new Error('League ID is not set in environment variables');
    }

    const data = await fetchPowerRankingsData(leagueId);
    rankings = calculatePowerRankings(data);
    leagueInfo = data.leagueInfo;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Power Rankings</h1>
        <h2 className="text-2xl mb-4">{leagueInfo.name} - {leagueInfo.season} Season</h2>
        <PowerRankingsTable rankings={rankings} />
      </div>
    </main>
  );
}
